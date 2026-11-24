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
                'university_code' => 'MAK',
                'student_number' => '22/U/10428/PS',
            ],
            [
                'name' => 'James Otieno',
                'email' => 'james.otieno@techcorp.co.ug',
                'roles' => ['supervisor'],
                'password' => 'InternTrack@2026!',
                'organization_code' => 'DEMO-ORG-001',
            ],
            [
                'name' => 'Fatuma Said',
                'email' => 'admin@techcorp.co.ug',
                'roles' => ['org_admin'],
                'password' => 'InternTrack@2026!',
                'organization_code' => 'DEMO-ORG-001',
            ],
            [
                'name' => 'Dr. Peter Kamau',
                'email' => 'dean@university.ac.ug',
                'roles' => ['uni_admin', 'system_admin'],
                'password' => 'InternTrack@2026!',
                'university_code' => 'MAK',
            ],
            [
                'name' => 'System Administrator',
                'email' => 'system@admin.com',
                'roles' => ['system_admin'],
                'password' => 'InternTrack@2026!',
            ],
        ];

        $makUni = \App\Models\University::where('code', 'MAK')->first();
        $demoOrg = \App\Models\Organization::first();
        $firstProg = \App\Models\Program::first();

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $userData['password'],
                    'email_verified_at' => now(),
                    'university_id' => !empty($userData['university_code']) ? $makUni?->id : null,
                    'organization_id' => !empty($userData['organization_code']) ? $demoOrg?->id : null,
                ]
            );

            $roleIds = Role::whereIn('slug', $userData['roles'])
                ->pluck('id');

            $user->roles()->sync($roleIds);

            if (in_array('supervisor', $userData['roles']) && $demoOrg) {
                \App\Models\Supervisor::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'organization_id' => $demoOrg->id,
                        'job_title' => 'Lead Systems Architect & Field Mentor',
                        'department' => 'Engineering',
                        'phone' => '+256 701 884 310',
                        'status' => 'active',
                    ]
                );
            }

            if (in_array('student', $userData['roles']) && $firstProg) {
                $student = \App\Models\Student::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'program_id' => $firstProg->id,
                        'student_number' => $userData['student_number'] ?? '22/U/10428/PS',
                        'phone' => '+256 700 123 456',
                        'year_of_study' => 3,
                        'status' => 'active',
                    ]
                );

                $sup = \App\Models\Supervisor::whereHas('user', fn($q) => $q->where('email', 'james.otieno@techcorp.co.ug'))->first();

                if ($demoOrg) {
                    \App\Models\Placement::updateOrCreate(
                        ['student_id' => $student->id],
                        [
                            'organization_id' => $demoOrg->id,
                            'supervisor_id' => $sup?->id,
                            'start_date' => '2026-06-01',
                            'end_date' => '2026-08-31',
                            'status' => 'active',
                            'description' => 'Industrial training placement in enterprise cloud and systems architecture.',
                        ]
                    );
                }
            }
        }
    }
}