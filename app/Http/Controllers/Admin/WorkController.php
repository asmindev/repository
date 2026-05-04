<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Work::class);

        $works = Work::with(['author', 'category', 'department'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/works/index', [
            'works' => $works,
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

        if ($work->status !== 'approved') {
            return redirect()->back()
                ->with('error', 'Hanya karya yang ter-approve yang bisa dipublikasi.');
        }

        $work->update([
            'status' => 'published',
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

    public function trashed()
    {
        $works = Work::onlyTrashed()
            ->with(['author', 'category', 'department'])
            ->latest('deleted_at')
            ->paginate(20);

        return Inertia::render('admin/works/trashed', [
            'works' => $works,
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
        // if ($work->full_file_path) {
        //     Storage::disk('local')->delete($work->full_file_path);
        // }

        $work->forceDelete();

        return redirect()->back()
            ->with('success', 'Karya berhasil dihapus permanen.');
    }
}
