<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Redirect user after login based on their role.
     */
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false]);
        }

        $user = $request->user();

        $redirectTo = match (true) {
            $user->hasRole('admin')    => route('admin.dashboard'),
            $user->hasRole('lecturer') => route('lecturer.dashboard'),
            $user->hasRole('student')  => route('student.dashboard'),
            default                    => route('home'),
        };

        return redirect()->intended($redirectTo);
    }
}
