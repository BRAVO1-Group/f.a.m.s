<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;

class DemoUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Demo accounts are only for local development.
        if (! app()->environment('local')) {
            return;
        }

        $users = [
            [
                'name' => 'Alice Wanjiku',
                'email' => 'alice@university.ac.ug',
                'roles' => ['student'],
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'James Otieno',
                'email' => 'james.otieno@techcorp.co.ug',
                'roles' => ['supervisor'],
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'Fatuma Said',
                'email' => 'admin@techcorp.co.ug',
                'roles' => ['org_admin'],
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'Dr. Peter Kamau',
                'email' => 'dean@university.ac.ug',
                'roles' => ['uni_admin', 'system_admin'],
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'System Administrator',
                'email' => 'system@admin.com',
                'roles' => ['system_admin'],
                'password' => 'InternTrack@2026!',
            ],
            
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $userData['password'],
                    'email_verified_at' => now(),
                ]
            );

            $roleIds = Role::whereIn('slug', $userData['roles'])
                ->pluck('id');

            $user->roles()->sync($roleIds);
        }
    }
}