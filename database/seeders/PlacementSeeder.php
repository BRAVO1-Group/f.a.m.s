<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Organization;
use App\Models\Supervisor;
use App\Models\Placement;

class PlacementSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $placements = [
            [
                'student_number' => 'MAK/2024/001',
                'organization_code' => 'DEMO-ORG-001',
                'supervisor_email' => 'michael.ssemanda@example.test',
                'start_date' => '2026-11-02',
                'end_date' => '2027-02-02',
                'description' => 'Software development and IT support attachment.',
            ],
            [
                'student_number' => 'KYU/2024/002',
                'organization_code' => 'DEMO-ORG-002',
                'supervisor_email' => 'esther.namusoke@example.test',
                'start_date' => '2026-11-02',
                'end_date' => '2027-02-02',
                'description' => 'Operations and information systems attachment.',
            ],
            [
                'student_number' => 'MUST/2023/003',
                'organization_code' => 'DEMO-ORG-003',
                'supervisor_email' => 'robert.kato@example.test',
                'start_date' => '2026-11-02',
                'end_date' => '2027-02-02',
                'description' => 'Project coordination and ICT support attachment.',
            ],
        ];

        foreach ($placements as $data) {
            $student = Student::where(
                'student_number',
                $data['student_number']
            )->firstOrFail();

            $organization = Organization::where(
                'registration_number',
                $data['organization_code']
            )->firstOrFail();

            $supervisor = Supervisor::whereHas('user', function ($query) use ($data) {
                $query->where('email', $data['supervisor_email']);
            })->firstOrFail();

            Placement::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'organization_id' => $organization->id,
                    'supervisor_id' => $supervisor->id,
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                    'status' => 'active',
                    'description' => $data['description'],
                ]
            );
        }
    }
}