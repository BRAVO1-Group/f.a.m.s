<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Placement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MilestoneController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $placements = $this->visiblePlacements($user);
        $placementIds = (clone $placements)->pluck('id');

        $milestones = Milestone::with('placement.student.user', 'placement.student.program')
            ->whereIn('placement_id', $placementIds)
            ->latest()
            ->get()
            ->map(fn (Milestone $milestone) => [
                ...$milestone->toArray(),
                'student_id' => (string) $milestone->student_id,
                'student' => [
                    'id' => (string) $milestone->student_id,
                    'full_name' => $milestone->placement->student->user->name,
                    'email' => $milestone->placement->student->user->email,
                    'course' => $milestone->placement->student->program?->name,
                ],
            ]);

        $students = (clone $placements)
            ->with('student.user', 'student.program')
            ->get()
            ->pluck('student')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn ($student) => [
                'id' => (string) $student->id,
                'full_name' => $student->user->name,
                'email' => $student->user->email,
                'course' => $student->program?->name,
            ]);

        return Inertia::render('milestones', [
            'milestones' => $milestones,
            'students' => $students,
            'role' => DashboardController::primaryRole($user->roles()->pluck('slug')),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $role = DashboardController::primaryRole($user->roles()->pluck('slug'));
        abort_unless(in_array($role, ['supervisor', 'org_admin'], true), 403);

        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'phase' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target_week' => ['required', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'tasks' => ['required', 'array', 'min:1'],
            'tasks.*.id' => ['required', 'string', 'max:100'],
            'tasks.*.title' => ['required', 'string', 'max:255'],
            'tasks.*.completed' => ['required', 'boolean'],
        ]);

        $placement = $this->visiblePlacements($user)
            ->where('student_id', $validated['student_id'])
            ->where('status', 'active')
            ->latest()
            ->firstOrFail();

        Milestone::create([
            ...$validated,
            'placement_id' => $placement->id,
            'created_by' => $user->id,
            'status' => 'in_progress',
            'skills' => $validated['skills'] ?? [],
            'supervisor_feedback' => null,
        ]);

        return back()->with('success', 'Milestone created successfully.');
    }

    public function updateTasks(Request $request, Milestone $milestone)
    {
        $user = $request->user();
        abort_unless(
            DashboardController::primaryRole($user->roles()->pluck('slug')) === 'student',
            403,
            'Only students can update milestone progress.'
        );
        $student = $user->student;
        abort_unless($student && $milestone->student_id === $student->id, 404);

        $validated = $request->validate([
            'task_id' => ['required', 'string'],
            'completed' => ['required', 'boolean'],
        ]);

        $tasks = $milestone->tasks ?? [];
        $taskIndex = collect($tasks)->search(
            fn ($task) => ($task['id'] ?? null) === $validated['task_id']
        );
        abort_if($taskIndex === false, 404, 'Milestone task not found.');

        $tasks[$taskIndex]['completed'] = $validated['completed'];
        $completed = collect($tasks)->every(fn ($task) => $task['completed'] ?? false);
        $started = collect($tasks)->contains(fn ($task) => $task['completed'] ?? false);

        $milestone->update([
            'tasks' => $tasks,
            'status' => $completed ? 'completed' : ($started ? 'in_progress' : 'not_started'),
            'completed_at' => $completed ? now() : null,
        ]);

        return back()->with('success', 'Milestone progress updated.');
    }

    public function updateFeedback(Request $request, Milestone $milestone)
    {
        $role = DashboardController::primaryRole($request->user()->roles()->pluck('slug'));
        abort_unless(in_array($role, ['supervisor', 'org_admin'], true), 403);
        abort_unless(
            $this->visiblePlacements($request->user())->whereKey($milestone->placement_id)->exists(),
            404
        );

        $validated = $request->validate([
            'feedback' => ['nullable', 'string', 'max:5000'],
            'complete' => ['required', 'boolean'],
        ]);

        $milestone->update([
            'supervisor_feedback' => $validated['feedback'],
            'status' => $validated['complete'] ? 'completed' : $milestone->status,
            'completed_at' => $validated['complete'] ? now() : $milestone->completed_at,
        ]);

        return back()->with('success', 'Milestone feedback saved.');
    }

    private function visiblePlacements($user)
    {
        $role = DashboardController::primaryRole($user->roles()->pluck('slug'));
        $query = Placement::query();

        return match ($role) {
            'student' => $query->whereHas(
                'student',
                fn ($studentQuery) => $studentQuery->where('user_id', $user->id)
            ),
            'supervisor' => $query->where(
                'supervisor_id',
                $user->supervisor()->value('id') ?? -1
            ),
            'org_admin' => $query->where('organization_id', $user->organization_id ?? -1),
            'uni_admin' => $query->whereHas(
                'student.program.department',
                fn ($departmentQuery) => $departmentQuery->where(
                    'university_id',
                    $user->university_id ?? -1
                )
            ),
            'system_admin' => $query,
            default => abort(403, 'You are not allowed to view milestones.'),
        };
    }
}
