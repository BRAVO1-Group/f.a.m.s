<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\Placement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LogbookController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless(
            DashboardController::primaryRole($user->roles()->pluck('slug')) === 'student',
            403,
            'A student account is required to access the logbook.'
        );
        $student = $user->student;
        abort_unless($student, 403, 'A student account is required to access the logbook.');

        return Inertia::render('logbook', [
            'logbooks' => $student->placements()
                ->with('logbooks')
                ->get()
                ->flatMap(fn ($placement) => $placement->logbooks)
                ->sortByDesc('log_date')
                ->values()
                ->map(fn (Logbook $logbook) => [
                    'id' => $logbook->id,
                    'title' => $logbook->title ?? 'Daily activity',
                    'log_date' => $logbook->log_date->toDateString(),
                    'arrival_time' => $logbook->arrival_time,
                    'departure_time' => $logbook->departure_time,
                    'activities' => $logbook->activities,
                    'tools_used' => $logbook->tools_used ?? [],
                    'skills_learned' => $logbook->skills_learned,
                    'challenges' => $logbook->challenges,
                    'solutions' => $logbook->solutions,
                    'status' => $logbook->status,
                    'supervisor_feedback' => $logbook->supervisor_feedback,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $placement = $this->activeStudentPlacement($request->user());
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'log_date' => [
                'required',
                'date',
                Rule::unique('logbooks', 'log_date')->where('placement_id', $placement->id),
            ],
            'activities' => ['required', 'string'],
            'tools_used' => ['nullable', 'array'],
            'tools_used.*' => ['string', 'max:100'],
            'arrival_time' => ['nullable', 'date_format:H:i'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'skills_learned' => ['nullable', 'string'],
            'challenges' => ['nullable', 'string'],
            'solutions' => ['nullable', 'string'],
            'hours_worked' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'status' => ['required', 'in:draft,submitted'],
        ]);

        $logbook = Logbook::create([
            'placement_id' => $placement->id,
            'title' => $validated['title'],
            'log_date' => $validated['log_date'],
            'activities' => $validated['activities'],
            'tools_used' => $validated['tools_used'] ?? [],
            'arrival_time' => $validated['arrival_time'] ?? null,
            'departure_time' => $validated['departure_time'] ?? null,
            'skills_learned' => $validated['skills_learned'] ?? null,
            'challenges' => $validated['challenges'] ?? null,
            'solutions' => $validated['solutions'] ?? null,
            'hours_worked' => $validated['hours_worked'] ?? 8,
            'status' => $validated['status'],
            'submitted_at' => $validated['status'] === 'submitted' ? now() : null,
        ]);

        return $request->wantsJson()
            ? response()->json(['logbook' => $logbook], 201)
            : back()->with('success', 'Logbook entry created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $logbook = $this->studentLogbooks($request->user())
            ->whereKey($id)
            ->firstOrFail();
        abort_unless(
            in_array($logbook->status, ['draft', 'needs_correction'], true),
            403,
            'Only drafts and returned entries can be edited.'
        );

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'log_date' => [
                'sometimes',
                'date',
                Rule::unique('logbooks', 'log_date')
                    ->where('placement_id', $logbook->placement_id)
                    ->ignore($logbook->id),
            ],
            'arrival_time' => ['nullable', 'date_format:H:i'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'tools_used' => ['sometimes', 'array'],
            'tools_used.*' => ['string', 'max:100'],
            'activities' => ['sometimes', 'string'],
            'skills_learned' => ['nullable', 'string'],
            'challenges' => ['nullable', 'string'],
            'solutions' => ['nullable', 'string'],
            'hours_worked' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'status' => ['sometimes', 'in:draft,submitted'],
        ]);

        if (($validated['status'] ?? null) === 'submitted') {
            $validated['submitted_at'] = now();
            $validated['supervisor_feedback'] = null;
            $validated['reviewed_by'] = null;
            $validated['reviewed_at'] = null;
        }

        $logbook->update($validated);

        return $request->wantsJson()
            ? response()->json(['logbook' => $logbook])
            : back()->with('success', 'Logbook entry updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $logbook = $this->studentLogbooks($request->user())
            ->whereKey($id)
            ->firstOrFail();
        abort_unless(
            in_array($logbook->status, ['draft', 'needs_correction'], true),
            403,
            'Only drafts and returned entries can be deleted.'
        );

        $logbook->delete();

        return $request->wantsJson()
            ? response()->json(['deleted' => true])
            : back()->with('success', 'Logbook entry deleted successfully.');
    }

    private function activeStudentPlacement(User $user): Placement
    {
        abort_unless(
            DashboardController::primaryRole($user->roles()->pluck('slug')) === 'student',
            403,
            'A student account is required to submit logbooks.'
        );
        $student = $user->student;
        abort_unless($student, 403, 'A student account is required to submit logbooks.');

        $placement = $student->placements()
            ->where('status', 'active')
            ->latest()
            ->first();

        abort_unless($placement, 422, 'No active placement is assigned to this student.');

        return $placement;
    }

    private function studentLogbooks(User $user)
    {
        abort_unless(
            DashboardController::primaryRole($user->roles()->pluck('slug')) === 'student',
            403,
            'A student account is required to access logbooks.'
        );
        $student = $user->student;
        abort_unless($student, 403, 'A student account is required to access logbooks.');

        return Logbook::whereHas('placement', fn ($query) => $query->where('student_id', $student->id));
    }
}
