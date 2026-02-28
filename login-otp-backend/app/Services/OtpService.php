<?php

namespace App\Services;

use App\Models\OtpCode;
use App\Models\User;
use App\Mail\OtpCodeMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    // Genera y envía un OTP al correo
    public function generate(User $user, string $type, string $ip = null): void
    {
        // Invalida OTPs anteriores del mismo tipo
        OtpCode::where('user_id', $user->id)
            ->where('type', $type)
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        // Genera código de 6 dígitos
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Guarda en BD hasheado
        OtpCode::create([
            'user_id'    => $user->id,
            'email'      => $user->email,
            'code'       => Hash::make($code),
            'type'       => $type,
            'expires_at' => now()->addMinutes(10),
            'ip_address' => $ip,
        ]);

        // Envía email con el código en texto plano
        Mail::to($user->email)->send(new OtpCodeMail($code, $user->name));
    }

    // Verifica el código ingresado por el usuario
    public function verify(User $user, string $code, string $type): bool
    {
        $otp = OtpCode::where('user_id', $user->id)
            ->where('type', $type)
            ->whereNull('used_at')
            ->latest('created_at')
            ->first();

        // No existe OTP
        if (!$otp) {
            throw new \Exception('No hay un código activo para este usuario.');
        }

        // OTP expirado o demasiados intentos
        if (!$otp->isValid()) {
            throw new \Exception('El código ha expirado o superó los intentos permitidos.');
        }

        // Código incorrecto
        if (!Hash::check($code, $otp->code)) {
            $otp->incrementAttempts();
            throw new \Exception('Código incorrecto.');
        }

        // Todo bien — marca como usado
        $otp->markAsUsed();
        return true;
    }
}