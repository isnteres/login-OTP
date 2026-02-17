<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Manejar preflight CORS
Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/create-password', [AuthController::class, 'createPassword']);