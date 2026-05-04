<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::with(['department', 'roles'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return Inertia::render('admin/users/create');
    }

    public function store()
    {
        $this->authorize('create', User::class);

        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'nim' => ['nullable', 'string', 'unique:users,nim'],
            'nidn' => ['nullable', 'string', 'unique:users,nidn'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'role' => ['required', 'in:admin,dosen,mahasiswa'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'nim' => $validated['nim'] ?? null,
            'nidn' => $validated['nidn'] ?? null,
            'department_id' => $validated['department_id'] ?? null,
            'is_active' => true,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        return Inertia::render('admin/users/edit', [
            'user' => $user->load(['department', 'roles']),
        ]);
    }

    public function update(User $user)
    {
        $this->authorize('update', $user);

        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
            'nim' => ['nullable', 'string', 'unique:users,nim,' . $user->id],
            'nidn' => ['nullable', 'string', 'unique:users,nidn,' . $user->id],
            'department_id' => ['nullable', 'exists:departments,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return redirect()->back()
            ->with('success', 'User berhasil dihapus.');
    }
}
