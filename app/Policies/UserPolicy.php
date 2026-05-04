<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('user.view-any');
    }

    public function view(User $user, User $model): bool
    {
        return $user->can('user.view-any') || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->can('user.create');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('user.update');
    }

    public function delete(User $user, User $model): bool
    {
        // Cannot delete self
        if ($user->id === $model->id) return false;

        return $user->can('user.delete');
    }

    public function restore(User $user, User $model): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, User $model): bool
    {
        return $user->hasRole('admin');
    }
}
