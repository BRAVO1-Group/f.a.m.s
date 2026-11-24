<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Placement;
use App\Models\Logbook;
use App\Models\Department;
use App\Models\Organization;
use App\Models\Attendance;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $role = self::primaryRole($user->roles()->pluck('slug'));

        // Select the appropriate dashboard data.
        $dashboardData = match ($role) {
            'student' => $this->studentDashboard($user),

            'supervisor' => $this->supervisorDashboard($user),

            'org_admin' => $this->organizationDashboard($user),

            'uni_admin' => $this->universityDashboard($user),

            'system_admin' => $this->systemDashboard(),

            default => abort(403, 'You are not authorized to access this dashboard.'),
        };

        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData,
        ]);
    }

    public static function primaryRole(iterable $roleSlugs): ?string
    {
        $userRoles = collect($roleSlugs);
        $priority = ['system_admin', 'uni_admin', 'org_admin', 'supervisor', 'student'];

        return collect($priority)->first(
            fn ($slug) => $userRoles->contains($slug)
        );
    }

    /**
     * STUDENT DASHBOARD
     */
    private function studentDashboard(User $user): array
    {
        $student = Student::with([
            'program.department.university',
            'placements.organization',
            'placements.supervisor.user',
            'placements.logbooks',
        ])
            ->where('user_id', $user->id)
            ->first();

        $placements = $student?->placements ?? collect();

        $activePlacement = $placements->firstWhere('status', 'active');

        $logbooks = $placements->flatMap(
            fn ($placement) => $placement->logbooks
        );
        return [
            'student' => $student,

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

                'totalHours' => $logbooks->sum('hours_worked'),

                'loggedDays' => $logbooks
                    ->pluck('log_date')
                    ->unique()
                    ->count(),

                ...$this->placementActivityStats($placements),
            ],

            'recentLogbooks' => $logbooks
                ->sortByDesc('log_date')
                ->take(5)
                ->values(),
        ];
    }

    /**
     * SUPERVISOR DASHBOARD
     */
    private function supervisorDashboard(User $user): array
    {
        $supervisor = Supervisor::with([
            'organization',
            'placements.student.user',
            'placements.student.program.department',
            'placements.organization',
            'placements.logbooks',
        ])
            ->where('user_id', $user->id)
            ->first();

        $placements = $supervisor?->placements ?? collect();

        $logbooks = $placements->flatMap(
            fn ($placement) => $placement->logbooks
        );
        return [
            'supervisor' => $supervisor,

            'placements' => $placements,

            'students' => $placements
                ->pluck('student')
                ->filter()
                ->unique('id')
                ->values(),

            'statistics' => [
                'totalPlacements' => $placements->count(),

                'activePlacements' => $placements
                    ->where('status', 'active')
                    ->count(),

                'pendingPlacements' => $placements
                    ->where('status', 'pending')
                    ->count(),

                'totalStudents' => $placements
                    ->pluck('student_id')
                    ->unique()
                    ->count(),

                'totalLogbooks' => $logbooks->count(),

                'pendingLogbooks' => $logbooks
                    ->where('status', 'submitted')
                    ->count(),

                'approvedLogbooks' => $logbooks
                    ->where('status', 'approved')
                    ->count(),

                'totalHours' => $logbooks->sum('hours_worked'),

                ...$this->placementActivityStats($placements),
            ],

            'recentLogbooks' => $logbooks
                ->sortByDesc('log_date')
                ->take(5)
                ->values(),
        ];
    }

    /**
     * ORGANIZATION ADMINISTRATOR DASHBOARD
     */
    private function organizationDashboard(User $user): array
    {
        $organization = Organization::with([
            'supervisors.user',
            'placements.student.user',
            'placements.student.program.department',
            'placements.supervisor.user',
            'placements.logbooks',
        ])
            ->where('id', $user->organization_id)
            ->first();

        $placements = $organization?->placements ?? collect();

        $logbooks = $placements->flatMap(
            fn ($placement) => $placement->logbooks
        );
        return [
            'organization' => $organization,

            'supervisors' => $organization?->supervisors ?? collect(),

            'placements' => $placements,

            'students' => $placements
                ->pluck('student')
                ->filter()
                ->unique('id')
                ->values(),

            'statistics' => [
                'totalSupervisors' => $organization?->supervisors->count() ?? 0,

                'totalPlacements' => $placements->count(),

                'activePlacements' => $placements
                    ->where('status', 'active')
                    ->count(),

                'pendingPlacements' => $placements
                    ->where('status', 'pending')
                    ->count(),

                'totalStudents' => $placements
                    ->pluck('student_id')
                    ->unique()
                    ->count(),

                'totalLogbooks' => $logbooks->count(),

                'submittedLogbooks' => $logbooks
                    ->where('status', 'submitted')
                    ->count(),

                'approvedLogbooks' => $logbooks
                    ->where('status', 'approved')
                    ->count(),

                ...$this->placementActivityStats($placements),
            ],

            'recentPlacements' => $placements
                ->sortByDesc('created_at')
                ->take(5)
                ->values(),
        ];
    }

    /**
     * UNIVERSITY ADMINISTRATOR DASHBOARD
     */
    private function universityDashboard(User $user): array
    {
        $university = $user->university;
        $admins = $university?->admins()->with('roles')->get() ?? collect();


        $departments = Department::with('programs')
            ->where('university_id', $user->university_id)
            ->get();

        $students = Student::with([
            'user',
            'program.department',
            'placements',
        ])
            ->whereHas('program.department', function ($query) use ($user) {
                $query->where('university_id', $user->university_id);
            })
            ->get();

        $placements = Placement::with([
            'student.user',
            'student.program.department',
            'organization',
            'supervisor.user',
            'logbooks',
        ])
            ->whereHas('student.program.department', function ($query) use ($user) {
                $query->where('university_id', $user->university_id);
            })
            ->get();

        $logbooks = $placements->flatMap(
            fn ($placement) => $placement->logbooks
        );
        return [
            'university' => $university,

            'departments' => $departments,
            'admins'=> $admins,

            'students' => $students,

            'placements' => $placements,

            'statistics' => [
                'totalDepartments' => $departments->count(),

                'totalPrograms' => $departments
                    ->sum(fn ($department) => $department->programs->count()),

                'totalStudents' => $students->count(),

                'totalPlacements' => $placements->count(),

                'activePlacements' => $placements
                    ->where('status', 'active')
                    ->count(),

                'pendingPlacements' => $placements
                    ->where('status', 'pending')
                    ->count(),

                'totalLogbooks' => $logbooks->count(),

                'submittedLogbooks' => $logbooks
                    ->where('status', 'submitted')
                    ->count(),

                'approvedLogbooks' => $logbooks
                    ->where('status', 'approved')
                    ->count(),

                ...$this->placementActivityStats($placements),
            ],

            'recentPlacements' => $placements
                ->sortByDesc('created_at')
                ->take(5)
                ->values(),
        ];
    }

    private function placementActivityStats(Collection $placements): array
    {
        $placementIds = $placements->pluck('id');

        return [
            'attendanceShifts' => Attendance::whereIn('placement_id', $placementIds)->count(),
            'totalMilestones' => Milestone::whereIn('placement_id', $placementIds)->count(),
            'completedMilestones' => Milestone::whereIn('placement_id', $placementIds)
                ->where('status', 'completed')
                ->count(),
        ];
    }

    /**
     * SYSTEM ADMINISTRATOR DASHBOARD
     */
    private function systemDashboard(): array
    {
        return [
            'statistics' => [
                'totalUsers' => User::count(),

                'totalUniversities' => \App\Models\University::count(),

                'totalDepartments' => Department::count(),

                'totalOrganizations' => Organization::count(),

                'totalStudents' => Student::count(),

                'totalSupervisors' => Supervisor::count(),

                'totalPlacements' => Placement::count(),

                'activePlacements' => Placement::where(
                    'status',
                    'active'
                )->count(),

                'pendingPlacements' => Placement::where(
                    'status',
                    'pending'
                )->count(),

                'totalLogbooks' => Logbook::count(),

                'submittedLogbooks' => Logbook::where(
                    'status',
                    'submitted'
                )->count(),

                'approvedLogbooks' => Logbook::where(
                    'status',
                    'approved'
                )->count(),
            ],

            'recentUsers' => User::with('roles')
                ->latest()
                ->take(5)
                ->get(),

            'recentPlacements' => Placement::with([
                'student.user',
                'organization',
                'supervisor.user',
            ])
                ->latest()
                ->take(5)
                ->get(),

            'recentLogbooks' => Logbook::with([
                'placement.student.user',
                'placement.organization',
            ])
                ->latest()
                ->take(5)
                ->get(),
        ];
    }
}