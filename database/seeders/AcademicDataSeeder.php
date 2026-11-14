<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\University;

class AcademicDataSeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            [
                'name' => 'Makerere University',
                'code' => 'MAK',
                'country' => 'Uganda',
                'departments' => [
                    [
                        'name' => 'Computing and Information Technology',
                        'code' => 'CIT',
                        'programs' => [
                            [
                                'name' => 'Bachelor of Information Technology',
                                'code' => 'BIT',
                                'award' => "Bachelor's Degree",
                                'duration_years' => 3,
                            ],
                            [
                                'name' => 'Bachelor of Computer Science',
                                'code' => 'BCS',
                                'award' => "Bachelor's Degree",
                                'duration_years' => 3,
                            ],
                        ],
                    ],
                    [
                        'name' => 'Engineering',
                        'code' => 'ENG',
                        'programs' => [
                            [
                                'name' => 'Bachelor of Software Engineering',
                                'code' => 'BSE',
                                'award' => "Bachelor's Degree",
                                'duration_years' => 4,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kyambogo University',
                'code' => 'KYU',
                'country' => 'Uganda',
                'departments' => [
                    [
                        'name' => 'Computing and Information Science',
                        'code' => 'CIS',
                        'programs' => [
                            [
                                'name' => 'Bachelor of Information Technology',
                                'code' => 'BIT',
                                'award' => "Bachelor's Degree",
                                'duration_years' => 3,
                            ],
                        ],
                    ],
                    [
                        'name' => 'Education',
                        'code' => 'EDU',
                        'programs' => [
                            [
                                'name' => 'Bachelor of Education',
                                'code' => 'BED',
                                'award' => "Bachelor's Degree",
                                'duration_years' => 3,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Mbarara University of Science and Technology',
                'code' => 'MUST',
                'country' => 'Uganda',
                'departments' => [
                    [
                        'name' => 'Computer Science',
                        'code' => 'CSC',
                        'programs' => [
                            [
                                'name' => 'Bachelor of Computer Science',
                                'code' => 'BCS',
                                'award' => "Bachelor's Degree",
                                'duration_years' => 3,
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($universities as $universityData) {
            $departments = $universityData['departments'];

            unset($universityData['departments']);

            $university = University::updateOrCreate(
                ['code' => $universityData['code']],
                $universityData
            );

            foreach ($departments as $departmentData) {
                $programs = $departmentData['programs'];

                unset($departmentData['programs']);

                $department = $university->departments()->updateOrCreate(
                    ['code' => $departmentData['code']],
                    $departmentData
                );

                foreach ($programs as $programData) {
                    $department->programs()->updateOrCreate(
                        ['code' => $programData['code']],
                        $programData
                    );
                }
            }
        }
    }
}