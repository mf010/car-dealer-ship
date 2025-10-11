<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Log;
use App\Models\Request;
use App\Models\Type;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\LogPolicy;
use App\Policies\RequestPolicy;
use App\Policies\TypePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{

    protected $policies = [
        Type::class => TypePolicy::class,
        Category::class => CategoryPolicy::class,
        Request::class => RequestPolicy::class,
        Log::class => LogPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function register(): void
    {
        //
    }


    public function boot(): void
    {
        $this->registerPolicies();
    }
}
