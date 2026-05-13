<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

use App\Enums\WorkStatus;
use App\Enums\WorkVisibility;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

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

    public function showPreview(Work $work)
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

    public function preview(Work $work)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        // Generate a One-Time Use Token
        $token = Str::random(60);
        Cache::put('pdf_token_' . $token, $work->id, now()->addMinutes(2));

        return view('pdf-viewer', [
            'title' => $work->title,
            'pdfStreamUrl' => route('works.preview.stream', ['work' => $work->id, 'token' => $token])
        ]);
    }

    public function previewStream(Request $request, Work $work)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        $token = $request->query('token');
        
        // Atomically retrieve and delete the token (One-Time Use)
        $cachedWorkId = Cache::pull('pdf_token_' . $token);

        if (!$token || $cachedWorkId !== $work->id) {
            abort(403, 'Akses ditolak: Token tidak valid atau sudah digunakan.');
        }

        if (!$work->full_file_path || !Storage::disk('local')->exists($work->full_file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        $path = Storage::disk('local')->path($work->full_file_path);

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'X-Frame-Options' => 'SAMEORIGIN',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function download(Work $work)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        // Hard block based on can_download attribute
        abort_unless($work->can_download, 403, 'Unduhan tidak diizinkan untuk kategori ini.');

        if (!$work->full_file_path || !Storage::disk('local')->exists($work->full_file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        $work->increment('download_count');

        return response()->download(
            Storage::disk('local')->path($work->full_file_path),
            Str::slug($work->title) . '.pdf'
        );
    }

    public function downloadChapter(Work $work, \App\Models\WorkChapter $chapter)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        // Hard block based on can_download attribute
        abort_unless($work->can_download, 403, 'Unduhan tidak diizinkan untuk kategori ini.');

        if ($chapter->work_id !== $work->id || !$chapter->file_path || !Storage::disk('local')->exists($chapter->file_path)) {
            abort(404, 'File bab tidak ditemukan.');
        }

        return response()->download(
            Storage::disk('local')->path($chapter->file_path),
            Str::slug($work->title . '-bab-' . $chapter->chapter_number) . '.pdf'
        );
    }

    public function previewChapter(Work $work, \App\Models\WorkChapter $chapter)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        // Generate a One-Time Use Token
        $token = Str::random(60);
        Cache::put('pdf_chapter_token_' . $token, $chapter->id, now()->addMinutes(2));

        return view('pdf-viewer', [
            'title' => $chapter->title,
            'pdfStreamUrl' => route('works.chapters.preview.stream', ['work' => $work->id, 'chapter' => $chapter->id, 'token' => $token])
        ]);
    }

    public function previewChapterStream(Request $request, Work $work, \App\Models\WorkChapter $chapter)
    {
        // Only allow if published and public
        if ($work->status !== WorkStatus::PUBLISHED || $work->visibility !== WorkVisibility::PUBLIC) {
            abort(404);
        }

        $token = $request->query('token');
        
        // Atomically retrieve and delete the token (One-Time Use)
        $cachedChapterId = Cache::pull('pdf_chapter_token_' . $token);

        if (!$token || $cachedChapterId !== $chapter->id) {
            abort(403, 'Akses ditolak: Token tidak valid atau sudah digunakan.');
        }

        if ($chapter->work_id !== $work->id || !$chapter->file_path || !Storage::disk('local')->exists($chapter->file_path)) {
            abort(404, 'File bab tidak ditemukan.');
        }

        $path = Storage::disk('local')->path($chapter->file_path);

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'X-Frame-Options' => 'SAMEORIGIN',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
