<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Rrhh\EmployeeController;
use App\Http\Controllers\Audit\AuditController;
use App\Http\Controllers\Audit\RrhhAuditController;

// ── Rutas públicas ──────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('login',                    [AuthController::class, 'login']);
    Route::post('login/verify-otp',         [OtpController::class,  'verifyLoginOtp']);
    Route::post('login/change-password',    [AuthController::class, 'createPassword']);
    Route::post('register/send-otp',        [OtpController::class,  'sendRegisterOtp']);
    Route::post('register/verify-otp',      [OtpController::class,  'verifyRegisterOtp']);
    Route::post('register/create-password', [AuthController::class, 'createPassword']);
});

// ── Rutas protegidas ────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    Route::prefix('employees')->group(function () {
        Route::get('/',              [EmployeeController::class, 'index']);
        Route::post('/',             [EmployeeController::class, 'store']);
        Route::get('/{id}',          [EmployeeController::class, 'show']);
        Route::put('/{id}',          [EmployeeController::class, 'update']);
        Route::patch('/{id}/status', [EmployeeController::class, 'changeStatus']);
        Route::delete('/{id}',       [EmployeeController::class, 'destroy']);
    });

    Route::prefix('audit')->group(function () {
        Route::get('general',    [AuditController::class,     'index']);
        Route::get('summary',    [AuditController::class,     'summary']);
        Route::get('analytics',  [AuditController::class,     'analytics']);
        Route::get('rrhh',       [RrhhAuditController::class, 'index']);
        Route::get('rrhh/stats', [RrhhAuditController::class, 'stats']);
    });
});