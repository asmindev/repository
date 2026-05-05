<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use App\Models\Work;
use App\Models\WorkCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index(Request $request)
    {

        $works = Work::with(['author', 'category', 'department'])
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%")
                ->orWhereHas('author', fn($q) => $q->where('name', 'like', "%{$request->search}%")))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->department_id, fn($q) => $q->where('department_id', $request->department_id))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/works/index', [
            'works'       => $works,
            'filters'     => $request->only(['search', 'status', 'category_id', 'department_id']),
            'categories'  => WorkCategory::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create()
    {

        return Inertia::render('admin/works/create', [
            'categories'  => WorkCategory::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'authors'     => User::role('student')->orderBy('name')->get(['id', 'name', 'nim']),
            'supervisors' => User::role('lecturer')->orderBy('name')->get(['id', 'name', 'nidn']),
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'category_id'   => ['required', 'exists:work_categories,id'],
            'department_id'  => ['required', 'exists:departments,id'],
            'author_id'      => ['required', 'exists:users,id'],
            'supervisor_id'  => ['nullable', 'exists:users,id'],
            'title'          => ['required', 'string', 'max:500'],
            'abstract'       => ['required', 'string'],
            'keywords'       => ['required', 'string'],
            'year'           => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'language'       => ['required', 'in:id,en'],
            'visibility'     => ['required', 'in:public,restricted'],
            'full_file'      => ['nullable', 'file', 'mimes:pdf', 'max:51200'], // 50MB
            
            // Validation for chapters array
            'chapters'                 => ['nullable', 'array'],
            'chapters.*.title'         => ['required_with:chapters', 'string', 'max:255'],
            'chapters.*.chapter_number'=> ['required_with:chapters', 'integer', 'min:1', 'max:20'],
            'chapters.*.description'   => ['nullable', 'string', 'max:500'],
            'chapters.*.file'          => ['required_with:chapters', 'file', 'mimes:pdf', 'max:51200'],
        ]);

        // Handle file upload
        $filePath = null;
        $fileSize = null;
        if ($request->hasFile('full_file')) {
            $file = $request->file('full_file');
            $filePath = $file->store('works', 'local');
            $fileSize = $file->getSize();
        }

        // Parse keywords string into array
        $keywords = array_map('trim', explode(',', $validated['keywords']));
        $keywords = array_filter($keywords);

        $work = Work::create([
            'category_id'    => $validated['category_id'],
            'department_id'  => $validated['department_id'],
            'author_id'      => $validated['author_id'],
            'supervisor_id'  => $validated['supervisor_id'] ?? null,
            'title'          => $validated['title'],
            'abstract'       => $validated['abstract'],
            'keywords'       => $keywords,
            'year'           => $validated['year'],
            'language'       => $validated['language'],
            'visibility'     => $validated['visibility'],
            'full_file_path' => $filePath,
            'full_file_size' => $fileSize,
            'status'         => 'draft',
        ]);

        // Process chapters if any
        if ($request->has('chapters') && is_array($request->chapters)) {
            foreach ($request->chapters as $index => $chapterData) {
                // To get the file, we access the nested files array correctly
                $file = $request->file("chapters.{$index}.file");
                
                if ($file) {
                    $chapterFilePath = $file->store("works/{$work->id}/chapters", 'local');
                    
                    $work->chapters()->create([
                        'title'          => $chapterData['title'],
                        'chapter_number' => $chapterData['chapter_number'],
                        'description'    => $chapterData['description'] ?? null,
                        'file_path'      => $chapterFilePath,
                        'file_size'      => $file->getSize(),
                    ]);
                }
            }
        }

        return redirect()->route('admin.works.index')
            ->with('success', 'Karya berhasil ditambahkan.');
    }

    public function show(Work $work)
    {

        return Inertia::render('admin/works/show', [
            'work' => $work->load([
                'author',
                'supervisor',
                'category',
                'department',
                'chapters',
                'reviews' => fn($q) => $q->with('reviewer')->latest(),
            ]),
        ]);
    }

    public function publish(Work $work)
    {

        if ($work->status->value !== 'approved') {
            return redirect()->back()
                ->with('error', 'Hanya karya yang ter-approve yang bisa dipublikasi.');
        }

        $work->update([
            'status'       => 'published',
            'published_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Karya berhasil dipublikasi.');
    }

    public function changeStatus(Request $request, Work $work)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending_review,in_review,revision,approved,published,rejected',
        ]);

        $updateData = ['status' => $validated['status']];
        
        if ($validated['status'] === 'published' && !$work->published_at) {
            $updateData['published_at'] = now();
        }

        $work->update($updateData);

        return redirect()->back()->with('success', 'Status karya berhasil diperbarui.');
    }

    public function destroy(Work $work)
    {

        $work->delete();

        return redirect()->back()
            ->with('success', 'Karya berhasil dihapus.');
    }

    public function trashed(Request $request)
    {
        $works = Work::onlyTrashed()
            ->with(['author', 'category', 'department'])
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->latest('deleted_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/works/trashed', [
            'works'   => $works,
            'filters' => $request->only(['search']),
        ]);
    }

    public function restore($id)
    {
        $work = Work::withTrashed()->findOrFail($id);

        $work->restore();

        return redirect()->back()
            ->with('success', 'Karya berhasil dikembalikan.');
    }

    public function forceDelete($id)
    {
        $work = Work::withTrashed()->findOrFail($id);

        // TODO: Delete file dari storage
        // Storage::disk('local')->delete($work->full_file_path);

        $work->forceDelete();

        return redirect()->back()
            ->with('success', 'Karya berhasil dihapus permanen.');
    }
}
