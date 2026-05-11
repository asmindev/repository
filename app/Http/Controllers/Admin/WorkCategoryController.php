<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkCategory;
use Inertia\Inertia;

class WorkCategoryController extends Controller
{
    public function index()
    {
        $categories = WorkCategory::latest()
            ->paginate(20);

        return Inertia::render('admin/work-categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/work-categories/create');
    }

    public function store()
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255', 'unique:work_categories,name'],
            'slug' => ['required', 'string', 'max:255', 'unique:work_categories,slug'],
            'has_supervisors' => ['boolean'],
            'can_download' => ['boolean'],
            'description' => ['nullable', 'string'],
        ]);

        WorkCategory::create($validated);

        return redirect()->route('admin.work-categories.index')
            ->with('success', 'Kategori karya berhasil dibuat.');
    }

    public function edit(WorkCategory $workCategory)
    {
        return Inertia::render('admin/work-categories/edit', [
            'category' => $workCategory,
        ]);
    }

    public function update(WorkCategory $workCategory)
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255', 'unique:work_categories,name,' . $workCategory->id],
            'slug' => ['required', 'string', 'max:255', 'unique:work_categories,slug,' . $workCategory->id],
            'has_supervisors' => ['boolean'],
            'can_download' => ['boolean'],
            'description' => ['nullable', 'string'],
        ]);

        $workCategory->update($validated);

        return redirect()->route('admin.work-categories.index')
            ->with('success', 'Kategori karya berhasil diperbarui.');
    }

    public function destroy(WorkCategory $workCategory)
    {
        $workCategory->delete();

        return redirect()->back()
            ->with('success', 'Kategori karya berhasil dihapus.');
    }
}
