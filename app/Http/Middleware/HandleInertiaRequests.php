<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = [];
        $roles = [];

        if ($user) {
            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            $roles = $user->getRoleNames()->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'flash' => fn() => [
                'type' => session()->has('error')
                    ? 'error'
                    : (session()->has('success') ? 'success' : 'message'),
                'content' => session()->get('error')
                    ?? session()->get('success')
                    ?? session()->get('message'),
            ],
            'auth' => [
                'user' => $user ? array_merge(
                    $user->only(['id', 'name', 'email', 'nim', 'nidn', 'avatar', 'department_id', 'is_active', 'email_verified_at', 'created_at', 'updated_at', 'deleted_at']),
                    ['permissions' => $permissions, 'roles' => $roles]
                ) : null,
            ],
        ];
    }
}
