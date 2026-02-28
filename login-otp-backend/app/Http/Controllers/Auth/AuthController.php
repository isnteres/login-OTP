<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        private AuditService $auditService,
        private OtpService   $otpService
    ) {}

    // POST /api/auth/login
public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    // Usuario no existe
    if (!$user) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Correo o contraseña incorrectos',
        ], 401);
    }

    // Cuenta bloqueada
    if ($user->locked_until && $user->locked_until->isFuture()) {
        $minutos = now()->diffInMinutes($user->locked_until);
        return response()->json([
            'status'  => 'error',
            'message' => "Cuenta bloqueada. Intenta en {$minutos} minutos.",
        ], 403);
    }

    // Cuenta inactiva
    if ($user->status === 'inactivo') {
        return response()->json([
            'status'  => 'error',
            'message' => 'Tu cuenta está desactivada. Contacta a RRHH.',
        ], 403);
    }

    // Contraseña incorrecta
    if (!Hash::check($request->password, $user->password)) {
        $user->increment('failed_login_attempts');

        if ($user->failed_login_attempts >= 5) {
            $user->update(['locked_until' => now()->addMinutes(30)]);
        }

        $this->auditService->log(
            action:      'login_failed',
            userId:      $user->id,
            description: 'Intento de login fallido',
            request:     $request
        );

        return response()->json([
            'status'  => 'error',
            'message' => 'Correo o contraseña incorrectos',
        ], 401);
    }

    // Resetea intentos fallidos
    $user->update([
        'failed_login_attempts' => 0,
        'locked_until'          => null,
    ]);

    // Primer login — debe cambiar contraseña
    if ($user->is_temp_password) {
        return response()->json([
            'status'  => 'change_password',
            'email'   => $user->email,
            'message' => 'Debes crear una nueva contraseña',
        ], 200);
    }

    // Admin — entra directo sin OTP
    if ($user->role->name === 'admin') {
        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->auditService->log(
            action:      'login_success',
            userId:      $user->id,
            description: 'Login exitoso — admin sin OTP',
            request:     $request
        );

        return response()->json([
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role->name,
            ],
        ]);
    }

    // rrhh y empleado — envía OTP
    $this->otpService->generate($user, 'login', $request->ip());

    $this->auditService->log(
        action:      'otp_sent',
        userId:      $user->id,
        description: 'OTP de login enviado',
        request:     $request
    );

    return response()->json([
        'status'  => 'otp_required',
        'email'   => $user->email,
        'message' => 'Código enviado a ' . $user->email,
    ], 200);
}

    // POST /api/auth/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Sesión cerrada correctamente',
        ]);
    }

    // GET /api/auth/me
    public function me(Request $request)
    {
        $user = $request->user()->load('role', 'employee');

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ]);
    }

    // POST /api/auth/login/change-password
    public function createPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        $user->update([
            'password'         => bcrypt($request->password),
            'is_temp_password' => false,
            'is_first_login'   => false,
            'last_login_at'    => now(),
        ]);

        // Genera token directo — sin OTP porque es primer ingreso
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->auditService->log(
            action:      'first_login',
            userId:      $user->id,
            description: 'Primer login — contraseña cambiada',
            request:     $request
        );

        return response()->json([
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role->name,
            ],
        ]);
    }
}