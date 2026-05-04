<?php

namespace App\Http\Controllers\Lecturer;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // Get stats for dosen
        $stats = [
            'pending_reviews' => Work::where('status', 'pending_review')->count(),
            'in_review' => Work::where('status', 'in_review')->count(),
            'completed_reviews' => Work::whereHas(
                'reviews',
                fn($q) =>
                $q->where('reviewer_id', auth()->id())
                    ->whereIn('action', ['approved', 'rejected', 'revision'])
            )->count(),
        ];

        // Get works assigned for review
        $assignedWorks = Work::whereHas(
            'reviews',
            fn($q) =>
            $q->where('reviewer_id', auth()->id())
                ->where('action', 'assigned')
        )
            ->with(['author', 'category', 'department', 'reviews'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('lecturer/dashboard', [
            'stats' => $stats,
            'assignedWorks' => $assignedWorks,
        ]);
    }
}
