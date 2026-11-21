
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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


// Public routes

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::get('/auth', function () {
    return Inertia::render('auth/login');
})->name('auth');


// Authenticated routes

Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile');

    Route::put('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    // University management
    Route::resource('universities', UniversityController::class);

    // Student management
    Route::resource('students', StudentController::class);

    // Supervisor management
    Route::resource('supervisors', SupervisorController::class);

    // Placement management
    Route::resource('placements', PlacementController::class);

    // Assignment management
    Route::resource('assignments', AssignmentController::class);

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index'])
        ->name('attendance');

    // Logbooks
    Route::get('/logbook', [LogbookController::class, 'index'])
        ->name('logbook');

    // Milestones
    Route::get('/milestones', [MilestoneController::class, 'index'])
        ->name('milestones');

    // Reviews
    Route::get('/review', [ReviewController::class, 'index'])
        ->name('review');

    // Evaluations
    Route::get('/evaluations', [EvaluationController::class, 'index'])
        ->name('evaluations');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])
        ->name('reports');

    // Role-based access control
    Route::get('/rbac', [RoleController::class, 'index'])
        ->name('rbac');

    // Admin placements page (existing URL)
    Route::get('/admin', [PlacementController::class, 'index'])
        ->name('admin');
});
