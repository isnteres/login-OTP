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
    // =====================
    //       REGISTRO
    // =====================

    // 1️⃣ Enviar OTP de registro
    public function registerSendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Correo inválido'], 422);
        }

        $email = $request->email;

        // Verificar si el correo ya está registrado
        if (User::where('email', $email)->exists()) {
            AuditLog::record('registro_intento', 'failed', $email, null, [
                'razon' => 'correo ya registrado'
            ]);

            return response()->json([
                'message' => 'Este correo ya está registrado'
            ], 409);
        }

        // Invalidar OTPs anteriores del mismo correo
        OtpCode::where('email', $email)
            ->where('type', 'registro')
            ->whereNull('used_at')
            ->delete();

        // Generar y guardar OTP
        $code = rand(100000, 999999);

        OtpCode::create([
            'email'      => $email,
            'code'       => $code,
            'type'       => 'registro',
            'expires_at' => now()->addMinutes(5),
        ]);

        // Enviar correo
        Mail::raw("Tu código de verificación es: $code", function ($message) use ($email) {
            $message->to($email)->subject('Código de verificación');
        });

        AuditLog::record('registro_otp_enviado', 'success', $email);

        return response()->json(['message' => 'Código enviado correctamente']);
    }

    // 2️⃣ Verificar OTP de registro
    public function registerVerifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|digits:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos'], 422);
        }

        $email = $request->email;

        $otpRecord = OtpCode::where('email', $email)
            ->where('code', $request->otp)
            ->where('type', 'registro')
            ->whereNull('used_at')
            ->latest()
            ->first();

        if (!$otpRecord) {
            AuditLog::record('registro_otp_fallido', 'failed', $email, null, [
                'razon' => 'código no encontrado'
            ]);

            return response()->json(['message' => 'Código inválido'], 400);
        }

        if ($otpRecord->isExpired()) {
            AuditLog::record('registro_otp_fallido', 'failed', $email, null, [
                'razon' => 'código expirado'
            ]);

            return response()->json(['message' => 'El código ha expirado'], 400);
        }

        // Marcar como usado
        $otpRecord->update(['used_at' => now()]);

        AuditLog::record('registro_otp_verificado', 'success', $email);

        return response()->json(['message' => 'Código verificado correctamente']);
    }

    // 3️⃣ Crear contraseña y finalizar registro
    public function registerCreatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos'], 422);
        }

        $email = $request->email;

        // Verificar que haya completado el OTP
        $otpVerified = OtpCode::where('email', $email)
            ->where('type', 'registro')
            ->whereNotNull('used_at')
            ->where('used_at', '>=', now()->subMinutes(10))
            ->exists();

        if (!$otpVerified) {
            return response()->json([
                'message' => 'Debes verificar el código OTP primero'
            ], 403);
        }

        // Crear el usuario
        $user = User::create([
            'email'             => $email,
            'password'          => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        AuditLog::record('registro_completado', 'success', $email, $user->id);

        return response()->json([
            'message' => 'Cuenta creada exitosamente',
            'user'    => ['id' => $user->id, 'email' => $user->email]
        ]);
    }

// =====================
//        LOGIN
// =====================

// 1️⃣ Verificar credenciales y enviar OTP
public function loginCredentials(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email'    => 'required|email',
        'password' => 'required'
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Datos inválidos'], 422);
    }

    $email = $request->email;
    $user  = User::where('email', $email)->first();

    // Verificar si el usuario existe y la contraseña es correcta
    if (!$user || !Hash::check($request->password, $user->password)) {
        AuditLog::record('login_fallido', 'failed', $email, null, [
            'razon' => 'credenciales incorrectas'
        ]);

        return response()->json([
            'message' => 'Correo o contraseña incorrectos'
        ], 401);
    }

    // Invalidar OTPs anteriores de login
    OtpCode::where('email', $email)
        ->where('type', 'login')
        ->whereNull('used_at')
        ->delete();

    // Generar y guardar OTP
    $code = rand(100000, 999999);

    OtpCode::create([
        'user_id'    => $user->id,
        'email'      => $email,
        'code'       => $code,
        'type'       => 'login',
        'expires_at' => now()->addMinutes(5),
    ]);

    // Enviar correo
    Mail::raw("Tu código de acceso es: $code", function ($message) use ($email) {
        $message->to($email)->subject('Código de acceso');
    });

    AuditLog::record('login_otp_enviado', 'success', $email, $user->id);

    return response()->json([
        'message' => 'Credenciales correctas, revisa tu correo'
    ]);
}

// 2️⃣ Verificar OTP de login
public function loginVerifyOtp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'otp'   => 'required|digits:6'
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Datos inválidos'], 422);
    }

    $email = $request->email;

    $otpRecord = OtpCode::where('email', $email)
        ->where('code', $request->otp)
        ->where('type', 'login')
        ->whereNull('used_at')
        ->latest()
        ->first();

    if (!$otpRecord) {
        AuditLog::record('login_otp_fallido', 'failed', $email, null, [
            'razon' => 'código no encontrado'
        ]);

        return response()->json(['message' => 'Código inválido'], 400);
    }

    if ($otpRecord->isExpired()) {
        AuditLog::record('login_otp_fallido', 'failed', $email, null, [
            'razon' => 'código expirado'
        ]);

        return response()->json(['message' => 'El código ha expirado'], 400);
    }

    // Marcar OTP como usado
    $otpRecord->update(['used_at' => now()]);

    $user = User::where('email', $email)->first();

    AuditLog::record('login_exitoso', 'success', $email, $user->id);

    return response()->json([
        'message' => 'Bienvenido',
        'user'    => ['id' => $user->id, 'email' => $user->email]
    ]);
}
}