<?php

namespace App\Http\Controllers\Lecturer;

use App\Http\Controllers\Controller;
use App\Models\Work;
use App\Models\WorkReview;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function pending()
    {
        $this->authorize('viewAny', Work::class);

        $works = Work::where('status', 'pending_review')
            ->with(['author', 'category', 'department', 'reviews'])
            ->latest()
            ->paginate(15);

        return Inertia::render('lecturer/reviews/pending', [
            'works' => $works,
        ]);
    }

    public function show(Work $work)
    {
        $this->authorize('view', $work);

        return Inertia::render('lecturer/reviews/show', [
            'work' => $work->load([
                'author',
                'category',
                'department',
                'supervisor',
                'chapters',
                'reviews' => fn($q) => $q->with('reviewer')->latest(),
            ]),
        ]);
    }

    public function approve(Work $work)
    {
        $this->authorize('approve', $work);

        $validated = request()->validate([
            'comment' => ['nullable', 'string'],
        ]);

        // Batalkan review action lama jika ada
        $work->reviews()
            ->where('reviewer_id', Auth::id())
            ->whereIn('action', ['in_review', 'revision', 'rejected'])
            ->delete();

        // Buat review baru
        WorkReview::create([
            'work_id' => $work->id,
            'reviewer_id' => Auth::id(),
            'action' => 'approved',
            'comment' => $validated['comment'] ?? null,
            'reviewed_at' => now(),
        ]);

        $work->update(['status' => 'approved']);

        return redirect()->back()
            ->with('success', 'Karya berhasil di-approve.');
    }

    public function reject(Work $work)
    {
        $this->authorize('reject', $work);

        $validated = request()->validate([
            'comment' => ['required', 'string', 'min:10'],
        ]);

        // Batalkan review action lama jika ada
        $work->reviews()
            ->where('reviewer_id', Auth::id())
            ->whereIn('action', ['in_review', 'approved', 'revision'])
            ->delete();

        // Buat review baru
        WorkReview::create([
            'work_id' => $work->id,
            'reviewer_id' => Auth::id(),
            'action' => 'rejected',
            'comment' => $validated['comment'],
            'reviewed_at' => now(),
        ]);

        $work->update(['status' => 'rejected']);

        return redirect()->back()
            ->with('success', 'Karya ditolak. Mahasiswa akan melihat komentar.');
    }

    public function requestRevision(Work $work)
    {
        $this->authorize('review', $work);

        $validated = request()->validate([
            'comment' => ['required', 'string', 'min:10'],
        ]);

        // Batalkan review action lama jika ada
        $work->reviews()
            ->where('reviewer_id', Auth::id())
            ->whereIn('action', ['in_review', 'approved', 'rejected'])
            ->delete();

        // Buat review baru
        WorkReview::create([
            'work_id' => $work->id,
            'reviewer_id' => Auth::id(),
            'action' => 'revision',
            'comment' => $validated['comment'],
            'reviewed_at' => now(),
        ]);

        $work->update(['status' => 'revision']);

        return redirect()->back()
            ->with('success', 'Permintaan revisi dikirim ke mahasiswa.');
    }

    public function history()
    {
        $reviews = WorkReview::where('reviewer_id', Auth::id())
            ->with(['work' => fn($q) => $q->with(['author', 'category'])])
            ->latest('reviewed_at')
            ->paginate(20);

        return Inertia::render('lecturer/reviews/history', [
            'reviews' => $reviews,
        ]);
    }
}
