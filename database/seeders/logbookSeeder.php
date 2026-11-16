<?php

namespace Database\Seeders;

use App\Models\Placement;
use App\Models\Logbook;
use Illuminate\Database\Seeder;

class LogbookSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $logs = [
            // Sarah Nakato
            [
                'student_number' => 'MAK/2024/001',
                'entries' => [
                    [
                        'log_date' => '2026-11-02',
                        'activities' => 'Reported to the organization, met the IT team and received an introduction to the company systems and development environment.',
                        'skills_learned' => 'Workplace communication and understanding software development environments.',
                        'challenges' => 'Getting familiar with the company workflow.',
                        'hours_worked' => 8,
                        'status' => 'approved',
                    ],
                    [
                        'log_date' => '2026-11-03',
                        'activities' => 'Assisted in reviewing the existing website and identifying user interface improvements.',
                        'skills_learned' => 'Website evaluation and identifying usability issues.',
                        'challenges' => 'Understanding some sections of the existing codebase.',
                        'hours_worked' => 7.5,
                        'status' => 'submitted',
                    ],
                    [
                        'log_date' => '2026-11-04',
                        'activities' => 'Practised writing basic frontend components and making small interface adjustments.',
                        'skills_learned' => 'React components and frontend development.',
                        'challenges' => 'Debugging component rendering issues.',
                        'hours_worked' => 8,
                        'status' => 'submitted',
                    ],
                ],
            ],

            // David Okello
            [
                'student_number' => 'KYU/2024/002',
                'entries' => [
                    [
                        'log_date' => '2026-11-02',
                        'activities' => 'Attended workplace orientation and learned about the organization operations and information systems.',
                        'skills_learned' => 'Workplace procedures and information systems awareness.',
                        'challenges' => 'Learning the organization internal procedures.',
                        'hours_worked' => 8,
                        'status' => 'approved',
                    ],
                    [
                        'log_date' => '2026-11-03',
                        'activities' => 'Assisted with entering and organizing operational records in the organization database.',
                        'skills_learned' => 'Data entry and database record management.',
                        'challenges' => 'Identifying and correcting incomplete records.',
                        'hours_worked' => 7,
                        'status' => 'submitted',
                    ],
                    [
                        'log_date' => '2026-11-04',
                        'activities' => 'Observed how staff generate reports and retrieve information from the organization information system.',
                        'skills_learned' => 'Information retrieval and report generation.',
                        'challenges' => 'Understanding the reporting process.',
                        'hours_worked' => 8,
                        'status' => 'submitted',
                    ],
                ],
            ],

            // Grace Atim
            [
                'student_number' => 'MUST/2023/003',
                'entries' => [
                    [
                        'log_date' => '2026-11-02',
                        'activities' => 'Attended orientation and met the project coordination team. Received an introduction to ongoing projects.',
                        'skills_learned' => 'Team collaboration and project coordination.',
                        'challenges' => 'Understanding the different project responsibilities.',
                        'hours_worked' => 8,
                        'status' => 'approved',
                    ],
                    [
                        'log_date' => '2026-11-03',
                        'activities' => 'Assisted in organizing project documentation and updating activity records.',
                        'skills_learned' => 'Documentation and record keeping.',
                        'challenges' => 'Organizing documents into the correct categories.',
                        'hours_worked' => 7.5,
                        'status' => 'submitted',
                    ],
                    [
                        'log_date' => '2026-11-04',
                        'activities' => 'Participated in a project progress review and helped prepare activity summaries.',
                        'skills_learned' => 'Progress reporting and professional communication.',
                        'challenges' => 'Summarizing project information accurately.',
                        'hours_worked' => 8,
                        'status' => 'submitted',
                    ],
                ],
            ],
        ];

        foreach ($logs as $studentLogs) {
            $placement = Placement::whereHas('student', function ($query) use ($studentLogs) {
                $query->where(
                    'student_number',
                    $studentLogs['student_number']
                );
            })->firstOrFail();

            foreach ($studentLogs['entries'] as $entry) {
                Logbook::updateOrCreate(
                    [
                        'placement_id' => $placement->id,
                        'log_date' => $entry['log_date'],
                    ],
                    $entry
                );
            }
        }
    }
}