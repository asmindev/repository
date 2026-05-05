<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     * Hanya cek role yang diminta — tidak ada admin bypass di sini.
     * Admin seharusnya hanya akses /admin/* dan tidak perlu bypass role lain.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasRole($role)) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
