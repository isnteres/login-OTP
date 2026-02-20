<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;

Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

// Registro
Route::post('/register/send-otp', [AuthController::class, 'registerSendOtp']);
Route::post('/register/verify-otp', [AuthController::class, 'registerVerifyOtp']);
Route::post('/register/create-password', [AuthController::class, 'registerCreatePassword']);

// Login (lo construiremos en el paso 4)
Route::post('/login/credentials', [AuthController::class, 'loginCredentials']);
Route::post('/login/verify-otp', [AuthController::class, 'loginVerifyOtp']);

// Auditoría
Route::get('/audit/summary', [AuditController::class, 'summary']);
Route::get('/audit/logs', [AuditController::class, 'logs']);