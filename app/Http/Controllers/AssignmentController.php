<?php

namespace App\Http\Controllers;

use App\Models\Placement;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index()
    {
        return response()->json([
            'assignments' => Placement::with(['student.user', 'organization', 'supervisor.user'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'placement_id' => ['nullable', 'exists:placements,id'],
            'student_id' => ['nullable', 'exists:students,id'],
            'supervisor_id' => ['required', 'exists:supervisors,id'],
        ]);

        $placement = ! empty($validated['placement_id'])
            ? Placement::findOrFail($validated['placement_id'])
            : Placement::where('student_id', $validated['student_id'])->latest()->firstOrFail();

        $placement->update([
            'supervisor_id' => $validated['supervisor_id'],
        ]);

        return $request->wantsJson()
            ? response()->json(['assignment' => $placement->fresh(['student.user', 'supervisor.user'])])
            : back()->with('success', 'Supervisor assigned to student placement.');
    }

    public function update(Request $request, string $id)
    {
        $placement = Placement::findOrFail($id);

        $validated = $request->validate([
            'supervisor_id' => ['nullable', 'exists:supervisors,id'],
        ]);

        $placement->update([
            'supervisor_id' => $validated['supervisor_id'] ?? null,
        ]);

        return $request->wantsJson()
            ? response()->json(['assignment' => $placement->fresh(['student.user', 'supervisor.user'])])
            : back()->with('success', 'Supervisor pairing updated.');
    }

    public function destroy(Request $request, string $id)
    {
        $placement = Placement::findOrFail($id);
        $placement->update(['supervisor_id' => null]);

        return $request->wantsJson()
            ? response()->json(['unassigned' => true])
            : back()->with('success', 'Supervisor unassigned from placement.');
    }
}
