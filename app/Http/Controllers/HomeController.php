<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
    
class HomeController extends Controller
{
    // Public pages

    public function welcome()
    {
        return Inertia::render('welcome');
    }

    public function login()
    {
        return Inertia::render('auth/login');
    }

    // Main application pages

    public function dashboard()
    {
        return Inertia::render('dashboard');
    }

    public function profile()
    {
        return Inertia::render('profile');
    }

    public function students()
    {
        return Inertia::render('admin/students');
    }

    public function supervisors()
    {
        return Inertia::render('admin/supervisors');
    }

    public function placements()
    {
        return Inertia::render('admin/placements');
    }

    public function assignments()
    {
        return Inertia::render('admin/assignments');
    }

    public function attendance()
    {
        return Inertia::render('attendance');
    }

    public function logbook()
    {
        return Inertia::render('logbook');
    }

    public function milestones()
    {
        return Inertia::render('milestones');
    }

    public function review()
    {
        return Inertia::render('review');
    }

    public function evaluations()
    {
        return Inertia::render('evaluations');
    }

    public function reports()
    {
        return Inertia::render('reports');
    }

    public function roles()
    {
        return Inertia::render('admin/rbac');
    }
}