<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Work;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthorizationServiceProvider extends ServiceProvider
{
    /**
     * Register the authorization gates.
     */
    public function boot(): void
    {
        $this->registerWorkGates();
        $this->registerUserGates();
        $this->registerRoleGates();
    }

    /**
     * Register work-related gates.
     */
    private function registerWorkGates(): void
    {
        // Check if user can create work
        Gate::define('create-work', function (User $user): bool {
            return $user->can('work.create');
        });

        // Check if user can edit their own draft work
        Gate::define('edit-own-draft-work', function (User $user, Work $work): bool {
            return $work->author_id === $user->id
                && $work->status === 'draft'
                && $user->can('work.update-own');
        });

        // Check if user can delete their own draft work
        Gate::define('delete-own-draft-work', function (User $user, Work $work): bool {
            return $work->author_id === $user->id
                && $work->status === 'draft'
                && $user->can('work.delete-own');
        });

        // Check if user can submit work for review
        Gate::define('submit-work', function (User $user, Work $work): bool {
            return $work->author_id === $user->id
                && $work->status === 'draft'
                && $user->can('work.submit');
        });

        // Check if user can review work
        Gate::define('review-work', function (User $user, Work $work): bool {
            return in_array($work->status, ['pending_review', 'in_review'])
                && $user->can('work.review');
        });

        // Check if user can approve work
        Gate::define('approve-work', function (User $user, Work $work): bool {
            return $work->status === 'in_review'
                && $user->can('work.approve');
        });

        // Check if user can reject work
        Gate::define('reject-work', function (User $user, Work $work): bool {
            return $work->status === 'in_review'
                && $user->can('work.reject');
        });

        // Check if user can request revision
        Gate::define('request-revision', function (User $user, Work $work): bool {
            return $work->status === 'in_review'
                && $user->can('work.review');
        });

        // Check if user can publish work
        Gate::define('publish-work', function (User $user, Work $work): bool {
            return $work->status === 'approved'
                && $user->can('work.publish');
        });

        // Check if user can view work
        Gate::define('view-work', function (User $user, Work $work): bool {
            // Author can view their own work
            if ($work->author_id === $user->id) {
                return true;
            }

            // Supervisor can view if assigned
            if ($work->supervisor_id === $user->id) {
                return true;
            }

            // Admin can view any work
            if ($user->hasRole('admin')) {
                return true;
            }

            // Public works visible to everyone if published
            if ($work->status === 'published' && $work->visibility === 'public') {
                return true;
            }

            // Restricted works only for authenticated users with permission
            if ($work->status === 'published' && $work->visibility === 'restricted' && $user->can('work.view-any')) {
                return true;
            }

            return false;
        });

        // Check if user can view work list
        Gate::define('view-works', function (User $user): bool {
            return $user->can('work.view-any') || $user->can('work.view-own');
        });
    }

    /**
     * Register user-related gates.
     */
    private function registerUserGates(): void
    {
        // Check if user can manage users
        Gate::define('manage-users', function (User $user): bool {
            return $user->can('user.view-any');
        });

        // Check if user can create user
        Gate::define('create-user', function (User $user): bool {
            return $user->can('user.create');
        });

        // Check if user can edit user
        Gate::define('edit-user', function (User $user, User $targetUser): bool {
            // Cannot edit self
            if ($user->id === $targetUser->id) {
                return false;
            }

            return $user->can('user.update');
        });

        // Check if user can delete user
        Gate::define('delete-user', function (User $user, User $targetUser): bool {
            // Cannot delete self
            if ($user->id === $targetUser->id) {
                return false;
            }

            return $user->can('user.delete');
        });
    }

    /**
     * Register role-related gates.
     */
    private function registerRoleGates(): void
    {
        // Check if user is admin
        Gate::define('is-admin', function (User $user): bool {
            return $user->hasRole('admin');
        });

        // Check if user is lecturer
        Gate::define('is-lecturer', function (User $user): bool {
            return $user->hasRole('dosen');
        });

        // Check if user is student
        Gate::define('is-student', function (User $user): bool {
            return $user->hasRole('mahasiswa');
        });
    }
}
