<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditController;
// Importaciones nuevas para tu módulo CRM
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeTypeController;
use App\Http\Controllers\EmployeeController;
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


// ========================================================
// MÓDULO CRM - GESTIÓN INTERNA (RRHH)
// ========================================================
// Todo este grupo está protegido, requiere que el usuario haya iniciado sesión
// Vuelve a envolver tus rutas en el middleware auth:sanctum
Route::middleware('auth:sanctum')->prefix('crm')->group(function () {
    
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/employee-types', [EmployeeTypeController::class, 'index']);
    Route::get('/employee-types/{id}/positions', [EmployeeTypeController::class, 'getPositions']);
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    
});
