<?php

namespace App\Http\Controllers;

use App\Models\Placement;
use Illuminate\Http\Request;

class PlacementController extends Controller
{
    public function index()
    {
        return response()->json([
            'placements' => Placement::with(['student.user', 'organization', 'supervisor.user'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'organization_id' => ['required', 'exists:organizations,id'],
            'supervisor_id' => ['nullable', 'exists:supervisors,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ]);

        $placement = Placement::create([
            'student_id' => $validated['student_id'],
            'organization_id' => $validated['organization_id'],
            'supervisor_id' => $validated['supervisor_id'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'] ?? 'active',
            'description' => $validated['description'] ?? null,
        ]);

        return $request->wantsJson()
            ? response()->json(['placement' => $placement->load(['student.user', 'organization', 'supervisor.user'])], 201)
            : back()->with('success', 'Internship placement created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $placement = Placement::findOrFail($id);

        $validated = $request->validate([
            'organization_id' => ['sometimes', 'exists:organizations,id'],
            'supervisor_id' => ['nullable', 'exists:supervisors,id'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'status' => ['sometimes', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ]);

        $placement->update($validated);

        return $request->wantsJson()
            ? response()->json(['placement' => $placement->fresh(['student.user', 'organization', 'supervisor.user'])])
            : back()->with('success', 'Placement updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $placement = Placement::findOrFail($id);
        $placement->delete();

        return $request->wantsJson()
            ? response()->json(['deleted' => true])
            : back()->with('success', 'Placement deleted successfully.');
    }
}
