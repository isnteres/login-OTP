<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // =====================================================================
    //  LOGIN
    // =====================================================================
    public function loginCredentials(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos'], 422);
        }

        $email = $request->email;
        $user  = User::where('email', $email)->first();

        // Verificar bloqueo por intentos
        if ($user && $user->isLocked()) {
            AuditLog::record('login_bloqueado', 'failed', $email, $user->id);
            return response()->json([
                'message' => 'Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos.'
            ], 429);
        }

        // Verificar credenciales
        if (!$user || !Hash::check($request->password, $user->password)) {
            if ($user) {
                $user->incrementLoginAttempts();
                $remaining = max(0, 5 - $user->login_attempts);

                AuditLog::record('login_fallido', 'failed', $email, $user->id, [
                    'intentos_restantes' => $remaining,
                ]);

                if ($user->isLocked()) {
                    return response()->json([
                        'message' => 'Cuenta bloqueada por 5 intentos fallidos. Intenta en 15 minutos.'
                    ], 429);
                }

                return response()->json([
                    'message'             => 'Correo o contraseña incorrectos',
                    'intentos_restantes'  => $remaining,
                ], 401);
            }

            AuditLog::record('login_fallido', 'failed', $email);
            return response()->json(['message' => 'Correo o contraseña incorrectos'], 401);
        }

        // Credenciales correctas → resetear intentos
        $user->resetLoginAttempts();

        // Contraseña temporal: sin OTP
        if ($user->is_temporary_password) {
            AuditLog::record('login_temporal', 'success', $email, $user->id);

            return response()->json([
                'isTemporary' => true,
                'user'        => ['id' => $user->id, 'email' => $user->email, 'name' => $user->name],
            ]);
        }

        // Contraseña permanente: enviar OTP
        OtpCode::where('email', $email)->where('type', 'login')->whereNull('used_at')->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'user_id'    => $user->id,
            'email'      => $email,
            'code'       => $code,
            'type'       => 'login',
            'attempts'   => 0,
            'expires_at' => now()->addMinutes(5),
        ]);

        Mail::raw("Tu código de acceso es: $code\nVigencia: 5 minutos.", function ($msg) use ($email) {
            $msg->to($email)->subject('Código de acceso');
        });

        AuditLog::record('login_otp_enviado', 'success', $email, $user->id);

        return response()->json([
            'isTemporary' => false,
            'message'     => 'Credenciales correctas, revisa tu correo',
        ]);
    }

    public function loginVerifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos'], 422);
        }

        $email = $request->email;

        $otpRecord = OtpCode::where('email', $email)
            ->where('type', 'login')
            ->whereNull('used_at')
            ->latest()
            ->first();

        if (!$otpRecord) {
            AuditLog::record('login_otp_fallido', 'failed', $email, null, ['razon' => 'no encontrado']);
            return response()->json(['message' => 'Código inválido'], 400);
        }

        if ($otpRecord->isExpired()) {
            AuditLog::record('login_otp_fallido', 'failed', $email, null, ['razon' => 'expirado']);
            return response()->json(['message' => 'El código ha expirado'], 400);
        }

        // Verificar el código — con límite de intentos
        if ($otpRecord->code !== $request->otp) {
            $stillValid = $otpRecord->incrementAttempts();

            AuditLog::record('login_otp_fallido', 'failed', $email, null, [
                'razon'    => 'código incorrecto',
                'intentos' => $otpRecord->attempts,
            ]);

            if (!$stillValid) {
                return response()->json(['message' => 'Demasiados intentos. Solicita un nuevo código.'], 429);
            }

            return response()->json(['message' => 'Código incorrecto. Intenta de nuevo.'], 400);
        }

        $otpRecord->update(['used_at' => now()]);

        $user = User::where('email', $email)->first();
        AuditLog::record('login_exitoso', 'success', $email, $user->id);

        return response()->json([
    'message' => 'Bienvenido',
    'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role
    ]
]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'       => 'required|email',
            'newPassword' => [
                'required',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/', 
                'regex:/[!@#$%^&*]/',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'El correo no coincide con el registrado'], 400);
        }

        $user->update([
            'password'              => Hash::make($request->newPassword),
            'is_temporary_password' => false,
            'login_attempts'        => 0,
            'locked_until'          => null,
        ]);

        AuditLog::record('password_changed', 'success', $user->email, $user->id);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }

    // =====================================================================
    //  REGISTRO 
    // =====================================================================

    public function registerSendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), ['email' => 'required|email']);
        if ($validator->fails()) return response()->json(['message' => 'Correo inválido'], 422);

        $email = $request->email;

        if (User::where('email', $email)->exists()) {
            AuditLog::record('registro_intento', 'failed', $email, null, ['razon' => 'correo ya registrado']);
            return response()->json(['message' => 'Este correo ya está registrado'], 409);
        }

        OtpCode::where('email', $email)->where('type', 'registro')->whereNull('used_at')->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'email'      => $email,
            'code'       => $code,
            'type'       => 'registro',
            'attempts'   => 0,
            'expires_at' => now()->addMinutes(5),
        ]);

        Mail::raw("Tu código de verificación es: $code", function ($msg) use ($email) {
            $msg->to($email)->subject('Código de verificación');
        });

        AuditLog::record('registro_otp_enviado', 'success', $email);
        return response()->json(['message' => 'Código enviado correctamente']);
    }

    public function registerVerifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|digits:6',
        ]);
        if ($validator->fails()) return response()->json(['message' => 'Datos inválidos'], 422);

        $email     = $request->email;
        $otpRecord = OtpCode::where('email', $email)->where('code', $request->otp)
            ->where('type', 'registro')->whereNull('used_at')->latest()->first();

        if (!$otpRecord) {
            AuditLog::record('registro_otp_fallido', 'failed', $email, null, ['razon' => 'no encontrado']);
            return response()->json(['message' => 'Código inválido'], 400);
        }

        if ($otpRecord->isExpired()) {
            AuditLog::record('registro_otp_fallido', 'failed', $email, null, ['razon' => 'expirado']);
            return response()->json(['message' => 'El código ha expirado'], 400);
        }

        if ($otpRecord->code !== $request->otp) {
            $stillValid = $otpRecord->incrementAttempts();
            AuditLog::record('registro_otp_fallido', 'failed', $email, null, ['intentos' => $otpRecord->attempts]);
            if (!$stillValid) return response()->json(['message' => 'Demasiados intentos.'], 429);
            return response()->json(['message' => 'Código incorrecto'], 400);
        }

        $otpRecord->update(['used_at' => now()]);
        AuditLog::record('registro_otp_verificado', 'success', $email);
        return response()->json(['message' => 'Código verificado correctamente']);
    }

    public function registerCreatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|min:8',
        ]);
        if ($validator->fails()) return response()->json(['message' => 'Datos inválidos'], 422);

        $email = $request->email;

        $otpVerified = OtpCode::where('email', $email)->where('type', 'registro')
            ->whereNotNull('used_at')->where('used_at', '>=', now()->subMinutes(10))->exists();

        if (!$otpVerified) {
            return response()->json(['message' => 'Debes verificar el código OTP primero'], 403);
        }

        $user = User::create([
            'email'                 => $email,
            'password'              => Hash::make($request->password),
            'role'                  => 'employee',
            'is_temporary_password' => false,
            'email_verified_at'     => now(),
        ]);

        AuditLog::record('registro_completado', 'success', $email, $user->id);

        return response()->json([
            'message' => 'Cuenta creada exitosamente',
            'user'    => ['id' => $user->id, 'email' => $user->email],
        ]);
    }
}