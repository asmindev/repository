<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        // Admin can access all permission-based routes
        if ($user && $user->hasRole('admin')) {
            return $next($request);
        }

        // Check if user has the required permission
        if (!$user || !$user->can($permission)) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
