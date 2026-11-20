<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UniversityAdminSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $uniAdminRole = Role::where('slug', 'uni_admin')->firstOrFail();

        $admins = [
            [
                'name' => 'Dr. Grace Namazzi',
                'email' => 'uniadmin@university.ac.ug',
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'Prof. Samuel Mugisha',
                'email' => 'admin.mak@university.ac.ug',
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'Dr. Beatrice Akello',
                'email' => 'admin.kyu@university.ac.ug',
                'password' => 'InternTrack@2026!',
            ],
            [
                'name' => 'Dr. Joseph Tumusiime',
                'email' => 'admin.must@university.ac.ug',
                'password' => 'InternTrack@2026!',
            ],
        ];

        foreach ($admins as $adminData) {
            $user = User::updateOrCreate(
                ['email' => $adminData['email']],
                [
                    'name' => $adminData['name'],
                    'password' => $adminData['password'],
                    'email_verified_at' => now(),
                ]
            );

            $user->roles()->syncWithoutDetaching([
                $uniAdminRole->id,
            ]);
        }
    }
}
