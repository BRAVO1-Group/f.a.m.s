<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Role;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json([
            'students' => Student::with(['user', 'program', 'placements.organization'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'student_number' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'year_of_study' => ['nullable', 'integer', 'min:1', 'max:6'],
            'program_id' => ['nullable', 'exists:programs,id'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $student = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => 'InternTrack@2026!',
                'email_verified_at' => now(),
            ]);

            $roleId = Role::where('slug', 'student')->value('id');
            if ($roleId) {
                $user->roles()->syncWithoutDetaching([$roleId]);
            }

            $programId = $validated['program_id'] ?? Program::query()->value('id');

            return Student::create([
                'user_id' => $user->id,
                'program_id' => $programId,
                'student_number' => $validated['student_number'],
                'phone' => $validated['phone'] ?? null,
                'year_of_study' => $validated['year_of_study'] ?? 3,
                'status' => $validated['status'] ?? 'active',
            ]);
        });

        return $request->wantsJson()
            ? response()->json(['student' => $student->load('user')], 201)
            : back()->with('success', 'Student created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $student = Student::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'student_number' => ['sometimes', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'year_of_study' => ['nullable', 'integer', 'min:1', 'max:6'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($student, $validated) {
            if ($student->user && (isset($validated['name']) || isset($validated['email']))) {
                $student->user->update(array_filter([
                    'name' => $validated['name'] ?? null,
                    'email' => $validated['email'] ?? null,
                ]));
            }

            $student->update(array_intersect_key($validated, array_flip([
                'student_number',
                'phone',
                'year_of_study',
                'status',
            ])));
        });

        return $request->wantsJson()
            ? response()->json(['student' => $student->fresh('user')])
            : back()->with('success', 'Student updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return $request->wantsJson()
            ? response()->json(['deleted' => true])
            : back()->with('success', 'Student removed successfully.');
    }
}
