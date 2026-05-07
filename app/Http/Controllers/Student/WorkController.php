<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Work;
use App\Models\Department;
use App\Models\WorkCategory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Work::class);

        $works = Work::where('author_id', Auth::id())
            ->with(['category', 'department'])
            ->latest()
            ->paginate(15);

        return Inertia::render('student/works/index', [
            'works' => $works,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Work::class);

        $categories = WorkCategory::all(['id', 'name', 'slug']);
        $departments = Department::all(['id', 'name', 'slug']);

        return Inertia::render('student/works/create', [
            'categories' => $categories,
            'departments' => $departments,
            'supervisors' => \App\Models\User::role('lecturer')->where('is_supervisors', true)->orderBy('name')->get(['id', 'name', 'nidn']),
        ]);
    }

    public function store()
    {
        $this->authorize('create', Work::class);

        $validated = request()->validate([
            'category_id' => ['required', 'exists:work_categories,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['nullable', 'string'],
            'keywords' => ['nullable', 'array'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:' . now()->year],
            'language' => ['required', 'in:id,en'],
            'supervisor_ids' => ['nullable', 'array'],
            'supervisor_ids.*' => ['exists:users,id'],
        ]);

        $work = Work::create([
            ...$validated,
            'author_id' => Auth::id(),
            'status' => 'draft',
            'visibility' => 'public',
        ]);

        $work->supervisors()->sync($validated['supervisor_ids'] ?? []);

        return redirect()->route('student.works.show', $work)
            ->with('success', 'Karya berhasil dibuat sebagai draft.');
    }

    public function show(Work $work)
    {
        $this->authorize('view', $work);

        return Inertia::render('student/works/show', [
            'work' => $work->load(['category', 'department', 'author', 'supervisor', 'chapters', 'reviews']),
        ]);
    }

    public function edit(Work $work)
    {
        $this->authorize('update', $work);

        $categories = WorkCategory::all(['id', 'name', 'slug']);
        $departments = Department::all(['id', 'name', 'slug']);

        return Inertia::render('student/works/edit', [
            'work' => $work->load('supervisors'),
            'categories' => $categories,
            'departments' => $departments,
            'supervisors' => \App\Models\User::role('lecturer')->where('is_supervisors', true)->orderBy('name')->get(['id', 'name', 'nidn']),
        ]);
    }

    public function update(Work $work)
    {
        $this->authorize('update', $work);

        $validated = request()->validate([
            'category_id' => ['required', 'exists:work_categories,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['nullable', 'string'],
            'keywords' => ['nullable', 'array'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:' . now()->year],
            'language' => ['required', 'in:id,en'],
            'supervisor_ids' => ['nullable', 'array'],
            'supervisor_ids.*' => ['exists:users,id'],
        ]);

        $work->update($validated);

        $work->supervisors()->sync($validated['supervisor_ids'] ?? []);

        return redirect()->route('student.works.show', $work)
            ->with('success', 'Karya berhasil diperbarui.');
    }

    public function destroy(Work $work)
    {
        $this->authorize('delete', $work);

        $work->delete();

        return redirect()->route('student.works.index')
            ->with('success', 'Karya berhasil dihapus.');
    }
}
