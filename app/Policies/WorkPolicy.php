<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Work;

class WorkPolicy
{
    /**
     * Admin selalu diizinkan untuk semua aksi.
     * Method ini dipanggil sebelum method policy lainnya.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) return true;
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->can('work.view-any');
    }

    public function view(User $user, Work $work): bool
    {
        // Admin dapat melihat semua
        if ($user->can('work.view-any')) return true;

        // Author dapat melihat karyanya sendiri
        if ($work->author_id === $user->id) return true;

        // Supervisor dapat melihat
        if ($work->supervisor_id === $user->id) return true;

        // Reviewer dapat melihat
        if ($work->reviews()->where('reviewer_id', $user->id)->exists()) return true;

        return false;
    }

    public function create(User $user): bool
    {
        return $user->can('work.create');
    }

    public function update(User $user, Work $work): bool
    {
        // Hanya bisa edit jika draft dan milik sendiri
        if ($work->status !== 'draft') return false;
        if ($work->author_id !== $user->id) return false;

        return $user->can('work.update-own');
    }

    public function delete(User $user, Work $work): bool
    {
        // Hanya bisa hapus jika draft
        if ($work->status !== 'draft') return false;

        // Author dapat hapus punya sendiri
        if ($work->author_id === $user->id && $user->can('work.delete-own')) return true;

        // Admin dapat hapus
        if ($user->hasRole('admin')) return true;

        return false;
    }

    public function restore(User $user, Work $work): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Work $work): bool
    {
        return $user->hasRole('admin');
    }

    public function submit(User $user, Work $work): bool
    {
        if ($work->status !== 'draft') return false;
        if ($work->author_id !== $user->id) return false;

        return $user->can('work.submit');
    }

    public function review(User $user, Work $work): bool
    {
        if (!in_array($work->status, ['pending_review', 'in_review'])) return false;

        return $user->can('work.review');
    }

    public function approve(User $user, Work $work): bool
    {
        if ($work->status !== 'in_review') return false;

        return $user->can('work.approve');
    }

    public function reject(User $user, Work $work): bool
    {
        if (!in_array($work->status, ['in_review'])) return false;

        return $user->can('work.reject');
    }

    public function publish(User $user, Work $work): bool
    {
        if ($work->status !== 'approved') return false;

        return $user->can('work.publish');
    }
}
