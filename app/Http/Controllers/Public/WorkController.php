<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

use App\Enums\WorkStatus;
use App\Enums\WorkVisibility;

class WorkController extends Controller
{
    public function show(Work $work)
    {
        // Only show published and public works
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        // Increment view count
        $work->increment('view_count');

        $work = $work->load([
            'author' => fn($q) => $q->select(['id', 'name']),
            'category' => fn($q) => $q->select(['id', 'name', 'can_download']),
            'supervisors' => fn($q) => $q->select(['users.id', 'users.name']),
            'department' => fn($q) => $q->select(['id', 'name']),
            'chapters' => fn($q) => $q->select(['id', 'work_id', 'title', 'chapter_number']),
        ]);

        $canDownload = $work->category ? $work->category->can_download : false;

        return Inertia::render('public-pages/work-detail', [
            'work' => $work,
            'canDownload' => $canDownload,
        ]);
    }

    public function preview(Work $work)
    {
        $user = auth()->user();

        // Check authorization - owner, supervisor, reviewer, atau admin
        if (
            !$user ||
            (
                $work->author_id !== $user->id &&
                $work->supervisor_id !== $user->id &&
                !$work->reviews()->where('reviewer_id', $user->id)->exists() &&
                !$user->hasRole('admin')
            )
        ) {
            abort(403);
        }

        // Increment view count
        $work->increment('view_count');

        return Inertia::render('public-pages/work-preview', [
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

    public function download(Work $work)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        // Check if category allows download, no matter the user role
        if ($work->category && !$work->category->can_download) {
            //    404 karena ini adalah fitur yang tidak tersedia untuk publik, jadi lebih baik disembunyikan daripada memberikan pesan error yang berbeda
            abort(404);
        }

        if (!$work->full_file_path || !\Illuminate\Support\Facades\Storage::disk('local')->exists($work->full_file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        $work->increment('download_count');

        return response()->download(
            \Illuminate\Support\Facades\Storage::disk('local')->path($work->full_file_path),
            \Illuminate\Support\Str::slug($work->title) . '.pdf'
        );
    }

    public function downloadChapter(Work $work, \App\Models\WorkChapter $chapter)
    {
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        if ($work->category && !$work->category->can_download) {

            abort(404);
        }

        if ($chapter->work_id !== $work->id || !$chapter->file_path || !\Illuminate\Support\Facades\Storage::disk('local')->exists($chapter->file_path)) {
            abort(404, 'File bab tidak ditemukan.');
        }

        return response()->download(
            \Illuminate\Support\Facades\Storage::disk('local')->path($chapter->file_path),
            \Illuminate\Support\Str::slug($work->title . '-bab-' . $chapter->chapter_number) . '.pdf'
        );
    }
}
