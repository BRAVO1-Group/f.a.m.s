<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\Placement;
use Illuminate\Http\Request;

class LogbookController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'placement_id' => ['nullable', 'exists:placements,id'],
            'log_date' => ['required', 'date'],
            'activities' => ['required', 'string'],
            'skills_learned' => ['nullable', 'string'],
            'challenges' => ['nullable', 'string'],
            'hours_worked' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'status' => ['nullable', 'string', 'in:draft,submitted,approved,needs_correction'],
        ]);

        $placementId = $validated['placement_id'] ?? null;
        if (! $placementId) {
            $student = $request->user()?->student;
            $placementId = $student?->placements()->latest()->value('id')
                ?? Placement::query()->latest()->value('id');
        }

        $logbook = Logbook::create([
            'placement_id' => $placementId,
            'log_date' => $validated['log_date'],
            'activities' => $validated['activities'],
            'skills_learned' => $validated['skills_learned'] ?? null,
            'challenges' => $validated['challenges'] ?? null,
            'hours_worked' => $validated['hours_worked'] ?? 8,
            'status' => $validated['status'] ?? 'draft',
        ]);

        return $request->wantsJson()
            ? response()->json(['logbook' => $logbook], 201)
            : back()->with('success', 'Logbook entry created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $logbook = Logbook::findOrFail($id);

        $validated = $request->validate([
            'log_date' => ['sometimes', 'date'],
            'activities' => ['sometimes', 'string'],
            'skills_learned' => ['nullable', 'string'],
            'challenges' => ['nullable', 'string'],
            'hours_worked' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'status' => ['sometimes', 'string', 'in:draft,submitted,approved,needs_correction'],
        ]);

        $logbook->update($validated);

        return $request->wantsJson()
            ? response()->json(['logbook' => $logbook])
            : back()->with('success', 'Logbook entry updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $logbook = Logbook::findOrFail($id);
        $logbook->delete();

        return $request->wantsJson()
            ? response()->json(['deleted' => true])
            : back()->with('success', 'Logbook entry deleted successfully.');
    }
}
