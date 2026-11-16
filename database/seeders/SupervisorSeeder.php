<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Organization;
use App\Models\Supervisor;


class SupervisorSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $supervisorRole = Role::where('slug', 'supervisor')->firstOrFail();

        $supervisors = [
            [
                'name' => 'Michael Ssemanda',
                'email' => 'michael.ssemanda@example.test',
                'organization_code' => 'DEMO-ORG-001',
                'job_title' => 'Software Engineer',
                'department' => 'Information Technology',
                'phone' => '0702000001',
            ],
            [
                'name' => 'Esther Namusoke',
                'email' => 'esther.namusoke@example.test',
                'organization_code' => 'DEMO-ORG-002',
                'job_title' => 'Operations Manager',
                'department' => 'Operations',
                'phone' => '0702000002',
            ],
            [
                'name' => 'Robert Kato',
                'email' => 'robert.kato@example.test',
                'organization_code' => 'DEMO-ORG-003',
                'job_title' => 'Project Coordinator',
                'department' => 'Administration',
                'phone' => '0702000003',
            ],
        ];

        foreach ($supervisors as $data) {
            $organization = Organization::where(
                'registration_number',
                $data['organization_code']
            )->firstOrFail();

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => 'InternTrack@2026!',
                ]
            );

            $user->roles()->syncWithoutDetaching([
                $supervisorRole->id,
            ]);

            Supervisor::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'organization_id' => $organization->id,
                    'job_title' => $data['job_title'],
                    'department' => $data['department'],
                    'phone' => $data['phone'],
                    'status' => 'active',
                ]
            );
        }
    }
}