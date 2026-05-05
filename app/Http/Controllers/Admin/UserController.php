<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {

        $users = User::with(['department', 'roles'])
            ->when(request('search'), function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('nidn', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {

        $departments = Department::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/users/create', [
            'departments' => $departments,
        ]);
    }

    public function store()
    {

        $validated = request()->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'nim'           => ['nullable', 'string', 'unique:users,nim'],
            'nidn'          => ['nullable', 'string', 'unique:users,nidn'],
            'phone'         => ['nullable', 'string', 'max:20'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'role'          => ['required', 'in:admin,lecturer,student'],
        ]);

        $user = User::create([
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'password'      => bcrypt($validated['password']),
            'nim'           => $validated['nim'] ?? null,
            'nidn'          => $validated['nidn'] ?? null,
            'phone'         => $validated['phone'] ?? null,
            'department_id' => $validated['department_id'] ?? null,
            'is_active'     => true,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dibuat.');
    }

    public function edit(User $user)
    {

        $departments = Department::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/users/edit', [
            'user'        => $user->load(['department', 'roles']),
            'departments' => $departments,
        ]);
    }

    public function update(User $user)
    {

        $validated = request()->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email,' . $user->id],
            'nim'           => ['nullable', 'string', 'unique:users,nim,' . $user->id],
            'nidn'          => ['nullable', 'string', 'unique:users,nidn,' . $user->id],
            'phone'         => ['nullable', 'string', 'max:20'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'is_active'     => ['required', 'boolean'],
            'role'          => ['required', 'in:admin,lecturer,student'],
        ]);

        $user->update([
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'nim'           => $validated['nim'],
            'nidn'          => $validated['nidn'],
            'phone'         => $validated['phone'],
            'department_id' => $validated['department_id'],
            'is_active'     => $validated['is_active'],
        ]);

        // Sync role (remove old, assign new)
        $user->syncRoles([$validated['role']]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user)
    {

        $user->delete();

        return redirect()->back()
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}
