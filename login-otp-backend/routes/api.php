<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\AuditRrhhController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

// Autenticación
// Registro
Route::post('/register/send-otp', [AuthController::class, 'registerSendOtp']);
Route::post('/register/verify-otp', [AuthController::class, 'registerVerifyOtp']);
Route::post('/register/create-password', [AuthController::class, 'registerCreatePassword']);

// Login (lo construiremos en el paso 4)
Route::post('/login/credentials', [AuthController::class, 'loginCredentials']);
Route::post('/login/verify-otp', [AuthController::class, 'loginVerifyOtp']);
Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

// Empleados (RRHH - Personal)
Route::get('/employees',               [EmployeeController::class, 'index']);
Route::get('/employees/stats',         [EmployeeController::class, 'stats']);
Route::get('/employees/{id}',          [EmployeeController::class, 'show']);
Route::post('/employees',              [EmployeeController::class, 'store']);
Route::put('/employees/{id}',          [EmployeeController::class, 'update']);
Route::patch('/employees/{id}/block',  [EmployeeController::class, 'toggleBlock']);
Route::delete('/employees/{id}',       [EmployeeController::class, 'destroy']);

// Auditoría del sistema
Route::get('/audit/summary', [AuditController::class, 'summary']);
Route::get('/audit/logs', [AuditController::class, 'logs']);

// Auditoría RRHH
Route::get('/audit/rrhh/duplicates',   [AuditRrhhController::class, 'index']);

// Analítica web
Route::post('/analytics/track',        [AnalyticsController::class, 'track']);
Route::get('/analytics',               [AnalyticsController::class, 'index']);