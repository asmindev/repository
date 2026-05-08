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

        $like = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $works = Work::with(['author', 'category', 'department'])
            ->when($request->search, fn($q) => $q->where('title', $like, "%{$request->search}%")
                ->orWhereHas('author', fn($q) => $q->where('name', $like, "%{$request->search}%")))
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

        return Inertia::render('admin/works/create/page', [
            'categories'  => WorkCategory::orderBy('name')->get(['id', 'name', 'has_supervisors']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'students'    => User::role('student')->orderBy('name')->get(['id', 'name', 'nim']),
            'lecturers'   => User::role('lecturer')->orderBy('name')->get(['id', 'name', 'nidn']),
            'supervisors' => User::role('lecturer')->where('is_supervisors', true)->orderBy('name')->get(['id', 'name', 'nidn']),
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'category_id'   => ['required', 'exists:work_categories,id'],
            'department_id'  => ['required', 'exists:departments,id'],
            'author_type'    => ['required', 'in:student,lecturer'],
            'author_id'      => ['required'],
            'author_identifier' => [
                function ($attribute, $value, $fail) use ($request) {
                    $authorId = $request->input('author_id');
                    $authorType = $request->input('author_type');
                    $isExistingUser = is_numeric($authorId) && \App\Models\User::where('id', $authorId)->exists();

                    if (!$isExistingUser && empty($value)) {
                        $label = $authorType === 'student' ? 'NIM' : 'NIDN';
                        $fail("$label wajib diisi untuk penulis baru.");
                    }
                },
                'nullable',
                'max:50',
            ],
            'supervisor_ids' => [
                function ($attribute, $value, $fail) use ($request) {
                    $category = \App\Models\WorkCategory::find($request->category_id);
                    if ($request->author_type === 'student' && $category && $category->has_supervisors) {
                        if (empty($value) || !is_array($value) || count($value) < 1) {
                            $fail('Dosen pembimbing wajib diisi untuk kategori ini.');
                        }
                    }
                },
                'nullable',
                'array',
            ],
            'supervisor_ids.*' => ['exists:users,id'],
            'title'          => ['required', 'string', 'max:500'],
            'abstract'       => ['required', 'string'],
            'keywords'       => ['required', 'string'],
            'year'           => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'language'       => ['required', 'in:id,en'],
            'visibility'     => ['required', 'in:public,restricted'],
            'full_file'      => [
                'required',
                'file',
                'mimes:' . implode(',', config('kti.files.allowed_mimes')),
                'max:' . config('kti.files.max_size')
            ],
            'cover_image'    => [
                'required',
                'image',
                'mimes:' . implode(',', config('kti.files.cover_allowed_mimes')),
                'max:' . config('kti.files.cover_max_size')
            ],

            // Validation for chapters array
            'chapters'                 => ['nullable', 'array'],
            'chapters.*.title'         => ['required_with:chapters', 'string', 'max:255'],
            'chapters.*.chapter_number'=> ['required_with:chapters', 'integer', 'min:1', 'max:20'],
            'chapters.*.description'   => ['nullable', 'string', 'max:500'],
            'chapters.*.file'          => [
                'required_with:chapters',
                'file',
                'mimes:' . implode(',', config('kti.files.allowed_mimes')),
                'max:' . config('kti.files.max_size')
            ],
        ]);

        // Logic for Flexible Author
        $authorId = $validated['author_id'];
        $authorType = $validated['author_type'];

        if (!is_numeric($authorId) || !\App\Models\User::where('id', $authorId)->exists()) {
            $authorId = $this->getOrCreateAuthor($authorId, $validated['author_identifier'] ?? null, $authorType);
        }

        // Handle full file upload
        $filePath = null;
        $fileSize = null;
        if ($request->hasFile('full_file')) {
            $file = $request->file('full_file');
            $filePath = $file->store('works', 'local');
            $fileSize = $file->getSize();
        }

        // Handle cover image upload
        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('works/covers', 'public');
        }

        // Parse keywords string into array
        $keywords = array_map('trim', explode(',', $validated['keywords']));
        $keywords = array_filter($keywords);

        $work = Work::create([
            'category_id'       => $validated['category_id'],
            'department_id'     => $validated['department_id'],
            'author_id'         => $authorId,
            'title'             => $validated['title'],
            'abstract'          => $validated['abstract'],
            'keywords'          => $keywords,
            'year'              => $validated['year'],
            'language'          => $validated['language'],
            'visibility'        => $validated['visibility'],
            'cover_image_path'  => $coverPath,
            'full_file_path'    => $filePath,
            'full_file_size'    => $fileSize,
            'status'            => 'draft',
        ]);

        // Sync Supervisors (Multiple)
        $work->supervisors()->sync($validated['supervisor_ids'] ?? []);

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

    public function edit(Work $work)
    {
        return Inertia::render('admin/works/create/page', [
            'work'        => $work->load(['author', 'supervisors', 'chapters']),
            'categories'  => WorkCategory::orderBy('name')->get(['id', 'name', 'has_supervisors']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'students'    => User::role('student')->orderBy('name')->get(['id', 'name', 'nim']),
            'lecturers'   => User::role('lecturer')->orderBy('name')->get(['id', 'name', 'nidn']),
            'supervisors' => User::role('lecturer')->where('is_supervisors', true)->orderBy('name')->get(['id', 'name', 'nidn']),
        ]);
    }

    public function update(Request $request, Work $work)
    {
        $validated = $request->validate([
            'category_id'   => ['required', 'exists:work_categories,id'],
            'department_id'  => ['required', 'exists:departments,id'],
            'author_type'    => ['required', 'in:student,lecturer'],
            'author_id'      => ['required'],
            'author_identifier' => [
                function ($attribute, $value, $fail) use ($request) {
                    $authorId = $request->input('author_id');
                    $authorType = $request->input('author_type');
                    $isExistingUser = is_numeric($authorId) && User::where('id', $authorId)->exists();

                    if (!$isExistingUser && empty($value)) {
                        $label = $authorType === 'student' ? 'NIM' : 'NIDN';
                        $fail("$label wajib diisi untuk penulis baru.");
                    }
                },
                'nullable',
                'max:50',
            ],
            'supervisor_ids' => [
                function ($attribute, $value, $fail) use ($request) {
                    $category = WorkCategory::find($request->category_id);
                    if ($request->author_type === 'student' && $category && $category->has_supervisors) {
                        if (empty($value) || !is_array($value) || count($value) < 1) {
                            $fail('Dosen pembimbing wajib diisi untuk kategori ini.');
                        }
                    }
                },
                'nullable',
                'array',
            ],
            'supervisor_ids.*' => ['exists:users,id'],
            'title'          => ['required', 'string', 'max:500'],
            'abstract'       => ['required', 'string'],
            'keywords'       => ['required', 'string'],
            'year'           => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'language'       => ['required', 'in:id,en'],
            'visibility'     => ['required', 'in:public,restricted'],
            'full_file'      => [
                'nullable',
                'file',
                'mimes:' . implode(',', config('kti.files.allowed_mimes')),
                'max:' . config('kti.files.max_size')
            ],
            'cover_image'    => [
                'nullable',
                'image',
                'mimes:' . implode(',', config('kti.files.cover_allowed_mimes')),
                'max:' . config('kti.files.cover_max_size')
            ],
        ]);

        // Logic for Flexible Author
        $authorId = $validated['author_id'];
        $authorType = $validated['author_type'];

        if (!is_numeric($authorId) || !\App\Models\User::where('id', $authorId)->exists()) {
            $authorId = $this->getOrCreateAuthor($authorId, $validated['author_identifier'] ?? null, $authorType);
        }

        // Keywords
        $keywords = array_map('trim', explode(',', $validated['keywords']));
        $keywords = array_filter($keywords);

        $updateData = [
            'category_id'   => $validated['category_id'],
            'department_id'  => $validated['department_id'],
            'author_id'      => $authorId,
            'title'          => $validated['title'],
            'abstract'       => $validated['abstract'],
            'keywords'       => $keywords,
            'year'           => $validated['year'],
            'language'       => $validated['language'],
            'visibility'     => $validated['visibility'],
        ];

        // Handle full file upload
        if ($request->hasFile('full_file')) {
            if ($work->full_file_path) {
                Storage::disk('local')->delete($work->full_file_path);
            }
            $file = $request->file('full_file');
            $updateData['full_file_path'] = $file->store('works', 'local');
            $updateData['full_file_size'] = $file->getSize();
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            if ($work->cover_image_path) {
                Storage::disk('public')->delete($work->cover_image_path);
            }
            $updateData['cover_image_path'] = $request->file('cover_image')->store('works/covers', 'public');
        }

        $work->update($updateData);
        $work->supervisors()->sync($validated['supervisor_ids'] ?? []);

        // TODO: Handle chapters update if needed.
        // For now focusing on main document data.

        return redirect()->route('admin.works.index')
            ->with('success', 'Dokumen berhasil diperbarui.');
    }

    public function show(Work $work)
    {

        return Inertia::render('admin/works/show', [
            'work' => $work->load([
                'author',
                'supervisors' => fn($q) => $q->select('users.id', 'users.name', 'users.nidn'),
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
        $like = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $works = Work::onlyTrashed()
            ->with(['author', 'category', 'department'])
            ->when($request->search, fn($q) => $q->where('title', $like, "%{$request->search}%"))
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

    /**
     * Get or create a student user by name.
     */
    /**
     * Get or create an author user (Student or Lecturer).
     */
    private function getOrCreateAuthor(string $name, ?string $identifier = null, string $role = 'student'): int
    {
        // Cari user dengan role yang sesuai dan nama yang sama
        $user = User::role($role)->where('name', $name)->first();

        if (!$user) {
            // Jika tidak ada, buat baru
            $userData = [
                'name'      => $name,
                'email'     => strtolower(str_replace(' ', '.', $name)) . '.' . rand(100, 999) . ($role === 'student' ? '@student.mail' : '@lecturer.mail'),
                'password'  => bcrypt('password123'), // Default password
                'is_active' => true,
            ];

            if ($role === 'student') {
                $userData['nim'] = $identifier;
            } else {
                $userData['nidn'] = $identifier;
            }

            $user = User::create($userData);
            $user->assignRole($role);
        }

        return $user->id;
    }
}
