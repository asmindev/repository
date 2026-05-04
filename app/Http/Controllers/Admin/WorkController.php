<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Work;
use App\Models\WorkCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Work::class);

        $works = Work::with(['author', 'category', 'department'])
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%")
                ->orWhereHas('author', fn($q) => $q->where('name', 'like', "%{$request->search}%")))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->department_id, fn($q) => $q->where('department_id', $request->department_id))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/works/index', [
            'works'       => $works,
            'filters'     => $request->only(['search', 'status', 'category_id', 'department_id']),
            'categories'  => WorkCategory::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(Work $work)
    {
        $this->authorize('view', $work);

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
        $this->authorize('publish', $work);

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

    public function destroy(Work $work)
    {
        $this->authorize('delete', $work);

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
        $this->authorize('restore', $work);

        $work->restore();

        return redirect()->back()
            ->with('success', 'Karya berhasil dikembalikan.');
    }

    public function forceDelete($id)
    {
        $work = Work::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $work);

        // TODO: Delete file dari storage
        // Storage::disk('local')->delete($work->full_file_path);

        $work->forceDelete();

        return redirect()->back()
            ->with('success', 'Karya berhasil dihapus permanen.');
    }
}
