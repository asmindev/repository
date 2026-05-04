<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Work;
use App\Models\Department;
use App\Models\WorkCategory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();

        // Get stats for mahasiswa
        $stats = [
            'total_works' => Work::where('author_id', $user->id)->count(),
            'draft_works' => Work::where('author_id', $user->id)
                ->where('status', 'draft')
                ->count(),
            'pending_review' => Work::where('author_id', $user->id)
                ->where('status', 'pending_review')
                ->count(),
            'published_works' => Work::where('author_id', $user->id)
                ->where('status', 'published')
                ->count(),
        ];

        // Get recent works
        $recentWorks = Work::where('author_id', $user->id)
            ->with(['category', 'department'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('student/dashboard', [
            'stats' => $stats,
            'recentWorks' => $recentWorks,
        ]);
    }
}
