<?php

namespace App\Http\Controllers;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Load the authenticated user's student profile.
        $student = $user->student;

        // Retrieve only this student's placements and related records.
        $placements = $student
            ? $student->placements()
                ->with([
                    'organization',
                    'supervisor.user',
                    'logbooks',
                ])
                ->latest()
                ->get()
            : collect();

        // Collect logbook entries belonging to this student's placements.
        $logbooks = $placements->flatMap(
            fn ($placement) => $placement->logbooks
        );

        // Find the student's active placement.
        $activePlacement = $placements->firstWhere('status', 'active');

        // Calculate dashboard statistics.
        $dashboardData = [
            'activePlacement' => $activePlacement,

            'placements' => $placements,

            'statistics' => [
                'totalPlacements' => $placements->count(),

                'activePlacements' => $placements
                    ->where('status', 'active')
                    ->count(),

                'totalLogbooks' => $logbooks->count(),

                'submittedLogbooks' => $logbooks
                    ->where('status', 'submitted')
                    ->count(),

                'approvedLogbooks' => $logbooks
                    ->where('status', 'approved')
                    ->count(),

                'totalHours' => $logbooks
                    ->sum('hours_worked'),

                'loggedDays' => $logbooks
                    ->pluck('log_date')
                    ->unique()
                    ->count(),
            ],

            'recentLogbooks' => $logbooks
                ->sortByDesc('log_date')
                ->take(5)
                ->values(),
        ];

        return Inertia::render('dashboard', [
            'user' => $user,
            'dashboardData' => $dashboardData,
        ]);
    }
}
