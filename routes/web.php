<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\PlacementController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\MilestoneController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoleController;


// PUBLIC PAGE ROUTES

Route::get('/', [HomeController::class, 'welcome'])->name('welcome');
Route::get('/login', [HomeController::class, 'login'])->name('login');
Route::get('/auth', [HomeController::class, 'login'])->name('auth');
Route::get('/walkthrough', [HomeController::class, 'walkthrough'])->name('walkthrough');
Route::get('/mentor-onboard', [HomeController::class, 'mentorOnboard'])->name('mentor.onboard');

// AUTHENTICATED PAGE ROUTES

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [HomeController::class, 'profile'])->name('profile');
    Route::get('/students', [HomeController::class, 'students'])->name('students');
    Route::get('/students/{id}', [HomeController::class, 'studentDetail'])->name('students.show');
    Route::get('/supervisors', [HomeController::class, 'supervisors'])->name('supervisors');
    Route::get('/placements', [HomeController::class, 'placements'])->name('placements');
    Route::get('/assignments', [HomeController::class, 'assignments'])->name('assignments');
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance');
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn'])
        ->name('attendance.check-in');
    Route::patch('/attendance/{attendance}/check-out', [AttendanceController::class, 'checkOut'])
        ->name('attendance.check-out');
    Route::get('/logbook', [LogbookController::class, 'index'])->name('logbook');
    Route::get('/milestones', [MilestoneController::class, 'index'])->name('milestones');
    Route::post('/milestones', [MilestoneController::class, 'store'])->name('milestones.store');
    Route::patch('/milestones/{milestone}/tasks', [MilestoneController::class, 'updateTasks'])
        ->name('milestones.tasks.update');
    Route::patch('/milestones/{milestone}/feedback', [MilestoneController::class, 'updateFeedback'])
        ->name('milestones.feedback.update');
    Route::get('/evaluations', [HomeController::class, 'evaluations'])->name('evaluations');
    Route::get('/reports', [HomeController::class, 'reports'])->name('reports');
    Route::get('/rbac', [HomeController::class, 'roles'])->name('rbac');
    Route::get('/admin', [HomeController::class, 'placements'])->name('admin');

    // BUSINESS LOGIC ROUTES

    // Profile operations
    Route::put('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    // University operations
    Route::resource('universities', UniversityController::class);

    // Student operations
    Route::post('/students', [StudentController::class, 'store'])
        ->name('students.store');

    Route::put('/students/{id}', [StudentController::class, 'update'])
        ->name('students.update');

    Route::delete('/students/{id}', [StudentController::class, 'destroy'])
        ->name('students.destroy');

    // Supervisor operations
    Route::post('/supervisors', [SupervisorController::class, 'store'])
        ->name('supervisors.store');

    Route::put('/supervisors/{id}', [SupervisorController::class, 'update'])
        ->name('supervisors.update');

    Route::delete('/supervisors/{id}', [SupervisorController::class, 'destroy'])
        ->name('supervisors.destroy');

    // Placement operations
    Route::post('/placements', [PlacementController::class, 'store'])
        ->name('placements.store');

    Route::put('/placements/{id}', [PlacementController::class, 'update'])
        ->name('placements.update');

    Route::delete('/placements/{id}', [PlacementController::class, 'destroy'])
        ->name('placements.destroy');

    // Assignment operations
    Route::post('/assignments', [AssignmentController::class, 'store'])
        ->name('assignments.store');

    Route::put('/assignments/{id}', [AssignmentController::class, 'update'])
        ->name('assignments.update');

    Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy'])
        ->name('assignments.destroy');

    // Logbook CRUD operations
    Route::post('/logbooks', [LogbookController::class, 'store'])
        ->name('logbooks.store');

    Route::put('/logbooks/{id}', [LogbookController::class, 'update'])
        ->name('logbooks.update');

    Route::delete('/logbooks/{id}', [LogbookController::class, 'destroy'])
        ->name('logbooks.destroy');

         Route::get('/review', [ReviewController::class, 'index'])
        ->name('reviews.index');

    Route::get('/review/{logbook}', [ReviewController::class, 'show'])
        ->name('reviews.show');

    Route::patch('/review/{logbook}/approve', [ReviewController::class, 'approve'])
        ->name('reviews.approve');

    Route::patch('/review/{logbook}/return', [ReviewController::class, 'returnForCorrection'])
        ->name('reviews.return');
});
