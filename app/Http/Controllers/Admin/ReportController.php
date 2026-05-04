<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use App\Models\Work;
use App\Models\WorkCategory;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // ─── Summary stats ─────────────────────────────
        $totalUsers       = User::count();
        $totalWorks       = Work::count();
        $publishedWorks   = Work::where('status', 'published')->count();
        $pendingReviews   = Work::whereIn('status', ['pending_review', 'in_review'])->count();
        $totalDepartments = Department::count();
        $totalCategories  = WorkCategory::count();

        // ─── Works by status ───────────────────────────
        $worksByStatus = Work::selectRaw("status, count(*) as total")
            ->groupBy('status')
            ->pluck('total', 'status');

        // ─── Works by category ─────────────────────────
        $worksByCategory = WorkCategory::withCount('works')
            ->orderByDesc('works_count')
            ->get(['id', 'name'])
            ->map(fn($c) => ['name' => $c->name, 'count' => $c->works_count]);

        // ─── Works by department ────────────────────────
        $worksByDepartment = Department::withCount('works')
            ->orderByDesc('works_count')
            ->get(['id', 'name'])
            ->map(fn($d) => ['name' => $d->name, 'count' => $d->works_count]);

        // ─── Users by role ─────────────────────────────
        $usersByRole = User::join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->selectRaw('roles.name as role, count(*) as total')
            ->groupBy('roles.name')
            ->pluck('total', 'role');

        // ─── Recent works (last 10) ────────────────────
        $recentWorks = Work::with(['author:id,name', 'category:id,name'])
            ->latest()
            ->limit(10)
            ->get(['id', 'title', 'status', 'author_id', 'category_id', 'created_at']);

        return Inertia::render('admin/reports/index', [
            'stats' => [
                'totalUsers'       => $totalUsers,
                'totalWorks'       => $totalWorks,
                'publishedWorks'   => $publishedWorks,
                'pendingReviews'   => $pendingReviews,
                'totalDepartments' => $totalDepartments,
                'totalCategories'  => $totalCategories,
            ],
            'worksByStatus'     => $worksByStatus,
            'worksByCategory'   => $worksByCategory,
            'worksByDepartment' => $worksByDepartment,
            'usersByRole'       => $usersByRole,
            'recentWorks'       => $recentWorks,
        ]);
    }

    public function works()
    {
        $works = Work::with(['author', 'category', 'department'])
            ->latest()
            ->get();

        return Inertia::render('admin/reports/works', [
            'works' => $works,
        ]);
    }

    public function users()
    {
        $users = User::with(['department', 'roles'])
            ->latest()
            ->get();

        return Inertia::render('admin/reports/users', [
            'users' => $users,
        ]);
    }

    public function export()
    {
        $this->authorize('viewAny', Work::class);

        // TODO: Implement export logic (CSV/Excel)
        return redirect()->back()
            ->with('info', 'Fitur export sedang dalam pengembangan.');
    }
}
