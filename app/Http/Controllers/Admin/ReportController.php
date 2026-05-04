<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Work;
use App\Models\User;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/reports/index');
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
        // For now just return message
        return redirect()->back()
            ->with('info', 'Fitur export sedang dalam pengembangan.');
    }
}
