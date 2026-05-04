<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function show(Work $work)
    {
        // Only show published and public works
        if ($work->status !== 'published' || $work->visibility !== 'public') {
            abort(404);
        }

        // Increment view count
        $work->increment('view_count');

        return Inertia::render('public-pages/work-detail', [
            'work' => $work->load([
                'author' => fn($q) => $q->select(['id', 'name']),
                'category' => fn($q) => $q->select(['id', 'name']),
                'department' => fn($q) => $q->select(['id', 'name']),
                'chapters' => fn($q) => $q->select(['id', 'work_id', 'title', 'chapter_number']),
            ]),
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
}
