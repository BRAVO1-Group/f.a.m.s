<?php

namespace App\Http\Middleware;

use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share($request): array
    {
        return [
            ...parent::share($request),
        ];
    }
}

