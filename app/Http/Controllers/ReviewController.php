<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display logbooks the authenticated reviewer is allowed to access.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $visibleLogbooks = $this->visibleLogbooks($user)
            ->whereIn('status', ['submitted', 'approved', 'needs_correction']);

        $logbooks = (clone $visibleLogbooks)
            ->latest('log_date')
            ->get()
            ->map(fn (Logbook $logbook) => $this->formatLogbook($logbook));

        $students = $visibleLogbooks
            ->with('placement.student.user', 'placement.student.program')
            ->get()
            ->pluck('placement.student')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn ($student) => [
                'id' => (string) $student->id,
                'full_name' => $student->user->name,
                'email' => $student->user->email,
                'course' => $student->program?->name,
            ]);

        return Inertia::render('review', [
            'logbooks' => $logbooks,
            'students' => $students,
        ]);
    }

    /**
     * Display one logbook submission.
     */
    public function show(Request $request, Logbook $logbook): Response
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbook = $this->visibleLogbooks($user)
            ->whereIn('status', ['submitted', 'approved', 'needs_correction'])
            ->whereKey($logbook->id)
            ->firstOrFail();

        return Inertia::render('review', [
            'logbooks' => [$this->formatLogbook($logbook)],
            'students' => [[
                'id' => (string) $logbook->placement->student->id,
                'full_name' => $logbook->placement->student->user->name,
                'email' => $logbook->placement->student->user->email,
                'course' => $logbook->placement->student->program?->name,
            ]],
        ]);
    }

    /**
     * Approve a submitted logbook.
     */
    public function approve(Request $request, Logbook $logbook)
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbook = $this->visibleLogbooks($user)
            ->whereKey($logbook->id)
            ->firstOrFail();

        abort_unless($logbook->status === 'submitted', 422,
            'Only submitted logbooks can be approved.'
        );

        $logbook->update([
            'status' => 'approved',
            'supervisor_feedback' => $request->validate([
                'feedback' => ['required', 'string', 'max:5000'],
            ])['feedback'],
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Logbook approved successfully.');
    }

    /**
     * Return a submitted logbook to the student for correction.
     */
    public function returnForCorrection(Request $request, Logbook $logbook)
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbook = $this->visibleLogbooks($user)
            ->whereKey($logbook->id)
            ->firstOrFail();

        abort_unless($logbook->status === 'submitted', 422,
            'Only submitted logbooks can be returned.'
        );

        $logbook->update([
            'status' => 'needs_correction',
            'supervisor_feedback' => $request->validate([
                'feedback' => ['required', 'string', 'max:5000'],
            ])['feedback'],
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Logbook returned for correction.');
    }

    /**
     * Verify that the user has the logs:approve permission.
     */
    private function authorizeReview(User $user): void
    {
        $hasPermission = $user->roles()
            ->whereHas('permissions', function ($query) {
                $query->where('slug', 'logs:approve');
            })
            ->exists();

        abort_unless($hasPermission, 403, 'You are not allowed to review logbooks.');
    }

    /**
     * Return only logbooks within the reviewer's permitted scope.
     */
    private function visibleLogbooks(User $user)
    {
        $role = DashboardController::primaryRole($user->roles()->pluck('slug'));

        $query = Logbook::with([
            'placement.student.user',
            'placement.student.program.department',
            'placement.organization',
            'placement.supervisor.user',
        ]);

        switch ($role) {
            case 'supervisor':

                $supervisorId = $user->supervisor()->value('id');

                if (!$supervisorId) {
                    return $query->whereRaw('1 = 0');
                }

                $query->whereHas('placement', function ($placementQuery) use ($supervisorId) {
                    $placementQuery->where('supervisor_id', $supervisorId);
                });

                break;

            case 'org_admin':

                if (!$user->organization_id) {
                    return $query->whereRaw('1 = 0');
                }

                $query->whereHas('placement', function ($placementQuery) use ($user) {
                    $placementQuery->where('organization_id', $user->organization_id);
                });

                break;

            case 'uni_admin':

                if (!$user->university_id) {
                    return $query->whereRaw('1 = 0');
                }

                $query->whereHas(
                    'placement.student.program.department',
                    function ($departmentQuery) use ($user) {
                        $departmentQuery->where('university_id', $user->university_id);
                    }
                );

                break;

            case 'system_admin':

                // System administrators can access all logbooks.
                break;

            default:

                abort(403, 'You are not allowed to review logbooks.');
        }

        return $query;
    }

    private function formatLogbook(Logbook $logbook): array
    {
        $student = $logbook->placement->student;

        return [
            'id' => (string) $logbook->id,
            'student_id' => (string) $student->id,
            'student' => [
                'id' => (string) $student->id,
                'full_name' => $student->user->name,
                'email' => $student->user->email,
                'course' => $student->program?->name,
            ],
            'title' => $logbook->title ?? 'Daily activity',
            'description' => $logbook->activities,
            'activity_date' => $logbook->log_date->toDateString(),
            'arrival_time' => $logbook->arrival_time,
            'departure_time' => $logbook->departure_time,
            'tools_used' => $logbook->tools_used ?? [],
            'skills_gained' => $logbook->skills_learned
                ? array_values(array_filter(array_map('trim', explode(',', $logbook->skills_learned))))
                : [],
            'challenges' => $logbook->challenges,
            'solutions' => $logbook->solutions,
            'status' => $logbook->status,
            'submitted_at' => $logbook->submitted_at,
            'supervisor_feedback' => $logbook->supervisor_feedback,
            'reviewed_at' => $logbook->reviewed_at,
        ];
    }
}