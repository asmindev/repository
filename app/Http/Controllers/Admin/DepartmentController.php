<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Faculty;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('faculty')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/departments/index', [
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        $faculties = Faculty::all(['id', 'name']);

        return Inertia::render('admin/departments/create', [
            'faculties' => $faculties,
        ]);
    }

    public function store()
    {
        $validated = request()->validate([
            'faculty_id' => ['required', 'exists:faculties,id'],
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
            'slug' => ['required', 'string', 'max:255', 'unique:departments,slug'],
            'description' => ['nullable', 'string'],
        ]);

        Department::create($validated);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departemen berhasil dibuat.');
    }

    public function edit(Department $department)
    {
        $faculties = Faculty::all(['id', 'name']);

        return Inertia::render('admin/departments/edit', [
            'department' => $department,
            'faculties' => $faculties,
        ]);
    }

    public function update(Department $department)
    {
        $validated = request()->validate([
            'faculty_id' => ['required', 'exists:faculties,id'],
            'name' => ['required', 'string', 'max:255', 'unique:departments,name,' . $department->id],
            'slug' => ['required', 'string', 'max:255', 'unique:departments,slug,' . $department->id],
            'description' => ['nullable', 'string'],
        ]);

        $department->update($validated);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departemen berhasil diperbarui.');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->back()
            ->with('success', 'Departemen berhasil dihapus.');
    }
}
