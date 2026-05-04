<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // Admin can access all role-based routes
        if ($user && $user->hasRole('admin')) {
            return $next($request);
        }

        // Check if user has the required role
        if (!$user || !$user->hasRole($role)) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
