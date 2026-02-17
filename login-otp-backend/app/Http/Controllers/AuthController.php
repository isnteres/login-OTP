<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // 1️⃣ Enviar OTP
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $email = $request->email;

        // Generar OTP de 6 dígitos
        $otp = rand(100000, 999999);

        // Guardar en cache por 5 minutos
        Cache::put('otp_'.$email, $otp, now()->addMinutes(5));

        // Enviar correo
        Mail::raw("Tu código OTP es: $otp", function ($message) use ($email) {
            $message->to($email)
                    ->subject('Tu código OTP');
        });

        return response()->json([
            'message' => 'OTP enviado correctamente'
        ]);
    }

    // 2️⃣ Verificar OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6'
        ]);

        $cachedOtp = Cache::get('otp_'.$request->email);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json([
                'message' => 'OTP inválido o expirado'
            ], 400);
        }

        // Marcar como verificado
        Cache::put('verified_'.$request->email, true, now()->addMinutes(10));

        return response()->json([
            'message' => 'OTP verificado correctamente'
        ]);
    }

    // 3️⃣ Crear contraseña
    public function createPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $verified = Cache::get('verified_'.$request->email);

        if (!$verified) {
            return response()->json([
                'message' => 'Primero debes verificar el OTP'
            ], 403);
        }

        // Aquí normalmente guardarías en BD
        // Como no usamos BD, solo simulamos

        Cache::forget('otp_'.$request->email);
        Cache::forget('verified_'.$request->email);

        return response()->json([
            'message' => 'Contraseña creada correctamente'
        ]);
    }
}
