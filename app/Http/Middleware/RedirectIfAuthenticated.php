<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     * Redirect already-authenticated users to their role-based dashboard
     * instead of the generic /home route.
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                $redirectTo = match (true) {
                    $user->hasRole('admin')    => route('admin.dashboard'),
                    $user->hasRole('lecturer') => route('lecturer.dashboard'),
                    $user->hasRole('student')  => route('student.dashboard'),
                    default                    => route('home'),
                };

                return redirect($redirectTo);
            }
        }

        return $next($request);
    }
}
