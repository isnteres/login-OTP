<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Otp;
use Illuminate\Support\Facades\Mail;
use Throwable;

class AuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = mb_strtolower(trim($request->string('email')->value()));
        $otp = Otp::generate();

        Otp::store($email, $otp, 120);

        try {
            Mail::raw("Tu codigo OTP es: {$otp}. Expira en 2 minutos.", function ($message) use ($email) {
                $message->to($email)->subject('Codigo OTP');
            });
        } catch (Throwable $e) {
            Otp::clear($email);
            report($e);

            return response()->json([
                'message' => 'No se pudo enviar el OTP al correo',
            ], 500);
        }

        $response = [
            'message' => 'OTP enviado correctamente',
        ];

        if (app()->environment(['local', 'testing'])) {
            $response['otp'] = $otp;
        }

        return response()->json($response);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $email = mb_strtolower(trim($request->string('email')->value()));
        $status = Otp::verify($email, (string) $request->input('otp'));

        if ($status === 'valid') {
            return response()->json(['message' => 'Login exitoso']);
        }

        if ($status === 'expired') {
            return response()->json(['message' => 'OTP expirado'], 401);
        }

        if ($status === 'blocked') {
            return response()->json(['message' => 'Demasiados intentos. Solicita un nuevo OTP'], 429);
        }

        return response()->json(['message' => 'OTP incorrecto'], 401);
    }
}
