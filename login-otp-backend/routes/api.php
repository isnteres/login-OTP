<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeTypeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HrDiagnosticsController;
use App\Http\Controllers\AuditRrhhController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;

Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

// ========================================================
// AUTENTICACIÓN Y OTP
// ========================================================
Route::post('/register/send-otp', [AuthController::class, 'registerSendOtp']);
Route::post('/register/verify-otp', [AuthController::class, 'registerVerifyOtp']);
Route::post('/register/create-password', [AuthController::class, 'registerCreatePassword']);
Route::post('/login/credentials', [AuthController::class, 'loginCredentials']);
Route::post('/login/verify-otp', [AuthController::class, 'loginVerifyOtp']);
Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

// ========================================================
// EMPLEADOS (RRHH - Personal) - Rutas generales
// ========================================================
Route::get('/employees',               [EmployeeController::class, 'index']);
Route::get('/employees/stats',         [EmployeeController::class, 'stats']);
Route::get('/employees/{id}',          [EmployeeController::class, 'show']);
Route::post('/employees',              [EmployeeController::class, 'store']);
Route::put('/employees/{id}',          [EmployeeController::class, 'update']);
Route::patch('/employees/{id}/block',  [EmployeeController::class, 'toggleBlock']);
Route::delete('/employees/{id}',       [EmployeeController::class, 'destroy']);

// ========================================================
// CURSOS ONLINE (NUEVO MÓDULO)
// ========================================================
Route::get('/courses/stats/sales',     [CourseController::class, 'salesStats']);
Route::get('/courses',                 [CourseController::class, 'index']);
Route::get('/courses/{id}',            [CourseController::class, 'show']);
Route::post('/courses',                [CourseController::class, 'store']);
Route::put('/courses/{id}',            [CourseController::class, 'update']);
Route::patch('/courses/{id}/toggle',   [CourseController::class, 'toggleActive']);

// ========================================================
// DASHBOARD E INICIO
// ========================================================
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// ========================================================
// AUDITORÍA GENERAL
// ========================================================
Route::get('/audit/summary', [AuditController::class, 'summary']);
Route::get('/audit/logs', [AuditController::class, 'logs']);

// ========================================================
// AUDITORÍA RRHH Y ANALÍTICA WEB
// ========================================================
Route::get('/audit/rrhh/duplicates',   [AuditRrhhController::class, 'index']);
Route::post('/analytics/track',        [AnalyticsController::class, 'track']);
Route::get('/analytics',               [AnalyticsController::class, 'index']);

// ========================================================
// MÓDULO CRM - GESTIÓN INTERNA (RRHH) - PROTEGIDO
// ========================================================
Route::middleware('auth:sanctum')->prefix('crm')->group(function () {
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/employee-types', [EmployeeTypeController::class, 'index']);
    Route::get('/employee-types/{id}/positions', [EmployeeTypeController::class, 'getPositions']);
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/hr-diagnostics', HrDiagnosticsController::class)->middleware('can:view-diagnostics');
});