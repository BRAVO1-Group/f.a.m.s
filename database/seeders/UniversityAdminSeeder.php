<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\University;

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
        'university_code' => null,
    ],
    [
        'name' => 'Prof. Samuel Mugisha',
        'email' => 'admin.mak@university.ac.ug',
        'university_code' => 'MAK',
    ],
    [
        'name' => 'Dr. Beatrice Akello',
        'email' => 'admin.kyu@university.ac.ug',
        'university_code' => 'KYU',
    ],
    [
        'name' => 'Dr. Joseph Tumusiime',
        'email' => 'admin.must@university.ac.ug',
        'university_code' => 'MUST',
    ],
];

foreach ($admins as $adminData) {
    $university = $adminData['university_code']
        ? University::where('code', $adminData['university_code'])->firstOrFail()
        : null;

    $user = User::updateOrCreate(
        ['email' => $adminData['email']],
        [
            'name' => $adminData['name'],
            'password' => 'InternTrack@2026!',
            'university_id' => $university?->id,
            'email_verified_at' => now(),
        ]
    );

    $user->roles()->syncWithoutDetaching([
        $uniAdminRole->id,
    ]);
}

    }
}
