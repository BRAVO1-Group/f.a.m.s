<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Program;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Sample accounts are only for local development.
        if (! app()->environment('local')) {
            return;
        }

        $studentRole = Role::where('slug', 'student')->firstOrFail();

        $students = [
            [
                'name' => 'Sarah Nakato',
                'email' => 'sarah.nakato@university.ac.ug',
                'student_number' => 'MAK/2024/001',
                'phone' => '0701234567',
                'year_of_study' => 3,
                'university_code' => 'MAK',
                'department_code' => 'CIT',
                'program_code' => 'BIT',
            ],
            [
                'name' => 'David Okello',
                'email' => 'david.okello@university.ac.ug',
                'student_number' => 'KYU/2024/002',
                'phone' => '0771234567',
                'year_of_study' => 2,
                'university_code' => 'KYU',
                'department_code' => 'CIS',
                'program_code' => 'BIT',
            ],
            [
                'name' => 'Grace Atim',
                'email' => 'grace.atim@university.ac.ug',
                'student_number' => 'MUST/2023/003',
                'phone' => '0751234567',
                'year_of_study' => 3,
                'university_code' => 'MUST',
                'department_code' => 'CSC',
                'program_code' => 'BCS',
            ],
        ];

        foreach ($students as $studentData) {

            $program = Program::where('code', $studentData['program_code'])
                ->whereHas('department', function ($query) use ($studentData) {
                    $query->where('code', $studentData['department_code'])
                        ->whereHas('university', function ($query) use ($studentData) {
                            $query->where('code', $studentData['university_code']);
                        });
                })
                ->firstOrFail();

            $user = User::updateOrCreate(
                ['email' => $studentData['email']],
                [
                    'name' => $studentData['name'],
                    'password' => 'InternTrack@2026!',
                ]
            );

            $user->roles()->syncWithoutDetaching([
                $studentRole->id,
            ]);

            Student::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'program_id' => $program->id,
                    'student_number' => $studentData['student_number'],
                    'phone' => $studentData['phone'],
                    'year_of_study' => $studentData['year_of_study'],
                    'status' => 'active',
                ]
            );
        }
    }
}