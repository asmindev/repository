<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CATATAN: Middleware ini tidak digunakan di web.php saat ini.
 * Proteksi permission dilakukan melalui Policy (authorize()) di controller.
 * Middleware ini hanya tersedia jika suatu saat ingin proteksi di level route.
 *
 * Cara pakai: Route::middleware('permission:work.view-any')
 */
class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user || !$user->can($permission)) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
