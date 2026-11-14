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