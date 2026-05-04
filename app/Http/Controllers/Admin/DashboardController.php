<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Work;
use App\Models\Department;
use App\Models\WorkCategory;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // Get stats for admin dashboard
        $stats = [
            'totalUsers' => User::count(),
            'totalWorks' => Work::count(),
            'publishedWorks' => Work::where('status', 'published')->count(),
            'pendingReviews' => Work::where('status', 'pending_review')->orWhere('status', 'in_review')->count(),
            'totalDepartments' => Department::count(),
            'totalCategories' => WorkCategory::count(),
        ];

        // Get recent activities
        $recentWorks = Work::with(['author', 'category', 'department'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentWorks' => $recentWorks,
        ]);
    }
}
