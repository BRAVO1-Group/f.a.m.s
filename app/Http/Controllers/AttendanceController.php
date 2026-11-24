<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Placement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = DashboardController::primaryRole($user->roles()->pluck('slug'));
        $query = Attendance::with([
            'placement.student.user',
            'placement.organization',
            'placement.supervisor.user',
        ]);

        match ($role) {
            'student' => $query->whereHas(
                'placement.student',
                fn ($studentQuery) => $studentQuery->where('user_id', $user->id)
            ),
            'supervisor' => $query->whereHas(
                'placement',
                fn ($placementQuery) => $placementQuery->where(
                    'supervisor_id',
                    $user->supervisor()->value('id') ?? -1
                )
            ),
            'org_admin' => $query->whereHas(
                'placement',
                fn ($placementQuery) => $placementQuery->where(
                    'organization_id',
                    $user->organization_id ?? -1
                )
            ),
            'uni_admin' => $query->whereHas(
                'placement.student.program.department',
                fn ($departmentQuery) => $departmentQuery->where(
                    'university_id',
                    $user->university_id ?? -1
                )
            ),
            'system_admin' => null,
            default => abort(403, 'You are not allowed to view attendance records.'),
        };

        return Inertia::render('attendance', [
            'attendance' => $query->latest('attendance_date')->get()->map(fn (Attendance $entry) => [
                'id' => $entry->id,
                'attendance_date' => $entry->attendance_date->toDateString(),
                'check_in' => $entry->check_in->toIso8601String(),
                'check_out' => $entry->check_out?->toIso8601String(),
                'placement' => [
                    'student' => $entry->placement->student ? [
                        'user' => $entry->placement->student->user
                            ? ['name' => $entry->placement->student->user->name]
                            : null,
                    ] : null,
                    'organization' => $entry->placement->organization
                        ? ['name' => $entry->placement->organization->name]
                        : null,
                ],
            ]),
            'canRecordAttendance' => $role === 'student',
            'today' => now()->toDateString(),
        ]);
    }

    public function checkIn(Request $request)
    {
        $placement = $this->activeStudentPlacement($request);
        $date = now()->toDateString();

        $attendance = Attendance::firstOrCreate(
            [
                'placement_id' => $placement->id,
                'attendance_date' => $date,
            ],
            ['check_in' => now()]
        );

        abort_if(
            ! $attendance->wasRecentlyCreated,
            422,
            'Attendance has already been recorded for today.'
        );

        return back()->with('success', 'Checked in successfully.');
    }

    public function checkOut(Request $request, Attendance $attendance)
    {
        $placement = $this->activeStudentPlacement($request);
        abort_unless($attendance->placement_id === $placement->id, 404);
        abort_if($attendance->check_out, 422, 'This attendance record is already checked out.');

        $attendance->update(['check_out' => now()]);

        return back()->with('success', 'Checked out successfully.');
    }

    private function activeStudentPlacement(Request $request): Placement
    {
        $user = $request->user();
        abort_unless(
            DashboardController::primaryRole($user->roles()->pluck('slug')) === 'student',
            403,
            'Only students can record attendance.'
        );

        $placement = $user->student?->placements()
            ->where('status', 'active')
            ->latest()
            ->first();

        abort_unless($placement, 422, 'No active placement is assigned to this student.');

        return $placement;
    }
}
