<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Work;
use App\Policies\UserPolicy as PoliciesUserPolicy;
use App\Policies\WorkPolicy as PoliciesWorkPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }

    /**
     * Register authorization policies.
     */
    protected function registerPolicies(): void
    {
        \Illuminate\Support\Facades\Gate::policy(Work::class, PoliciesWorkPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(User::class, PoliciesUserPolicy::class);
    }
}
