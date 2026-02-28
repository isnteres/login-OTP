<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use App\Services\AuditService;
use Illuminate\Http\Request;

class OtpController extends Controller
{
    public function __construct(
        private OtpService   $otpService,
        private AuditService $auditService
    ) {}

    // POST /api/auth/register/send-otp
    public function sendRegisterOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$user->is_first_login) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Correo no encontrado o cuenta ya activada.',
            ], 404);
        }

        $this->otpService->generate($user, 'activation', $request->ip());

        return response()->json([
            'status'  => 'success',
            'message' => 'Código enviado a ' . $user->email,
        ]);
    }

    // POST /api/auth/register/verify-otp
    public function verifyRegisterOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        try {
            $this->otpService->verify($user, $request->otp, 'activation');
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Código verificado correctamente',
        ]);
    }

    // POST /api/auth/login/verify-otp
    public function verifyLoginOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        try {
            $this->otpService->verify($user, $request->otp, 'login');
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }

        // OTP correcto — genera token
        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->auditService->log(
            action:      'login_success',
            userId:      $user->id,
            description: 'Login exitoso con OTP',
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