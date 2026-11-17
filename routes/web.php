<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response(file_get_contents(public_path('index.html')), 200)
        ->header('Content-Type', 'text/html');
});

Route::fallback(function (Request $request) {
    if (app()->environment('local')) {
        $vitePort = env('VITE_PORT', 5173);

        return redirect()->away("http://{$request->getHost()}:{$vitePort}{$request->getRequestUri()}");
    }

    abort(404);
});
