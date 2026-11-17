<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::get('/auth', function () {
    return Inertia::render('auth/login');
})->name('auth');


Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/logbook', function () {
        return Inertia::render('logbook');
    })->name('logbook');

    Route::get('/attendance', function () {
        return Inertia::render('attendance');
    })->name('attendance');

    Route::get('/milestones', function () {
        return Inertia::render('milestones');
    })->name('milestones');

    Route::get('/review', function () {
        return Inertia::render('review');
    })->name('review');

    Route::get('/students', function () {
        return Inertia::render('admin/students');
    })->name('students');

    Route::get('/evaluations', function () {
        return Inertia::render('evaluations');
    })->name('evaluations');

    Route::get('/supervisors', function () {
        return Inertia::render('admin/supervisors');
    })->name('supervisors');

    Route::get('/assignments', function () {
        return Inertia::render('admin/assignments');
    })->name('assignments');

    Route::get('/rbac', function () {
        return Inertia::render('admin/rbac');
    })->name('rbac');

    Route::get('/admin', function () {
    return Inertia::render('admin/placements');
    })->name('admin');

    Route::get('/reports', function () {
        return Inertia::render('reports');
    })->name('reports');

    Route::get('/profile', function () {
        return Inertia::render('profile');
    })->name('profile');

});
