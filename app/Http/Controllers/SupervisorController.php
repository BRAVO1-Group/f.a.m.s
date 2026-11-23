<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Role;
use App\Models\Supervisor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupervisorController extends Controller
{
    public function index()
    {
        return response()->json([
            'supervisors' => Supervisor::with(['user', 'organization'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'organization_name' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $supervisor = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => 'InternTrack@2026!',
                'email_verified_at' => now(),
            ]);

            $roleId = Role::where('slug', 'supervisor')->value('id');
            if ($roleId) {
                $user->roles()->syncWithoutDetaching([$roleId]);
            }

            $orgId = $validated['organization_id'] ?? null;
            if (! $orgId && ! empty($validated['organization_name'])) {
                $org = Organization::firstOrCreate(
                    ['name' => $validated['organization_name']],
                    ['industry' => 'Technology & Operations', 'status' => 'active']
                );
                $orgId = $org->id;
            }
            $orgId = $orgId ?? Organization::query()->value('id');

            return Supervisor::create([
                'user_id' => $user->id,
                'organization_id' => $orgId,
                'job_title' => $validated['job_title'] ?? 'Workplace Field Mentor',
                'department' => $validated['department'] ?? 'Operations',
                'phone' => $validated['phone'] ?? null,
                'status' => $validated['status'] ?? 'active',
            ]);
        });

        return $request->wantsJson()
            ? response()->json(['supervisor' => $supervisor->load(['user', 'organization'])], 201)
            : back()->with('success', 'Supervisor account provisioned successfully.');
    }

    public function update(Request $request, string $id)
    {
        $supervisor = Supervisor::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($supervisor, $validated) {
            if ($supervisor->user && (isset($validated['name']) || isset($validated['email']))) {
                $supervisor->user->update(array_filter([
                    'name' => $validated['name'] ?? null,
                    'email' => $validated['email'] ?? null,
                ]));
            }

            $supervisor->update(array_intersect_key($validated, array_flip([
                'job_title',
                'department',
                'phone',
                'status',
            ])));
        });

        return $request->wantsJson()
            ? response()->json(['supervisor' => $supervisor->fresh(['user', 'organization'])])
            : back()->with('success', 'Supervisor updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $supervisor = Supervisor::findOrFail($id);
        $supervisor->delete();

        return $request->wantsJson()
            ? response()->json(['deleted' => true])
            : back()->with('success', 'Supervisor removed successfully.');
    }
}
