<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\AuditRrhhController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseClickController;

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

// Cursos
// Ruta de stats debe ir ANTES de /{id} para que Laravel no la interprete como id=stats
Route::get   ('/courses/stats/sales',    [CourseController::class, 'salesStats']);
Route::get   ('/courses',                [CourseController::class, 'index']);
Route::get   ('/courses/{id}',           [CourseController::class, 'show']);
Route::post  ('/courses',                [CourseController::class, 'store']);
Route::put   ('/courses/{id}',           [CourseController::class, 'update']);
Route::patch ('/courses/{id}/toggle',    [CourseController::class, 'toggleActive']);

//Dashboard (Panel Inicio)
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// Auditoría del sistema
Route::get('/audit/summary', [AuditController::class, 'summary']);
Route::get('/audit/logs', [AuditController::class, 'logs']);

// Auditoría RRHH
Route::get('/audit/rrhh/duplicates',   [AuditRrhhController::class, 'index']);

// Analítica web
Route::post('/analytics/track',        [AnalyticsController::class, 'track']);
Route::get('/analytics',               [AnalyticsController::class, 'index']);



// Analítica de clicks en cursos (landing)
Route::post('/course-clicks', [CourseClickController::class, 'store']);
Route::get('/course-clicks',  [CourseClickController::class, 'index']);