<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => fn () => $this->getAuthenticatedUser($request),
            ],
        ];
    }

    private function getAuthenticatedUser(Request $request): ?array
    {
        $user = $request->user();

        if (!$user) {
            return null;
        }

        $user->loadMissing('roles.permissions');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,

            'roles' => $user->roles->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'permissions' => $role->permissions
                    ->pluck('slug')
                    ->values(),
            ])->values(),

            'permissions' => $user->roles
                ->flatMap(fn ($role) => $role->permissions->pluck('slug'))
                ->unique()
                ->values(),
        ];
    }
}