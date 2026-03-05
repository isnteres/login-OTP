<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthService
{
    // OTP

    public function sendOtp(string $email, string $type, ?int $userId = null): void
    {
        OtpCode::where('email', $email)->where('type', $type)->whereNull('used_at')->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'user_id'    => $userId,
            'email'      => $email,
            'code'       => $code,
            'type'       => $type,
            'attempts'   => 0,
            'expires_at' => now()->addMinutes(5),
        ]);

        [$tipoLabel, $mensajeIntro, $subject] = $type === 'login'
            ? ['Código de acceso',       'Usá el siguiente código para completar tu inicio de sesión.',               'Tu código de acceso']
            : ['Verificación de cuenta', 'Usá el siguiente código para verificar tu correo y completar el registro.', 'Verificá tu cuenta'];

        Mail::send('emails.otp', compact('code', 'email', 'tipoLabel', 'mensajeIntro'),
            fn($m) => $m->to($email)->subject($subject)
        );
    }

    public function findOtp(string $email, string $type): ?OtpCode
    {
        return OtpCode::where('email', $email)
            ->where('type', $type)
            ->whereNull('used_at')
            ->latest()
            ->first();
    }

    public function validateOtp(OtpCode $otp, string $code, string $email, string $auditAction): array
    {
        if ($otp->isExpired()) {
            AuditLog::record($auditAction, 'failed', $email, null, ['razon' => 'expirado']);
            return ['ok' => false, 'status' => 400, 'message' => 'El código ha expirado'];
        }
        if ($otp->code !== $code) {
            $stillValid = $otp->incrementAttempts();
            AuditLog::record($auditAction, 'failed', $email, null, ['intentos' => $otp->attempts]);
            if (!$stillValid)
                return ['ok' => false, 'status' => 429, 'message' => 'Demasiados intentos. Solicitá un nuevo código.'];
            return ['ok' => false, 'status' => 400, 'message' => 'Código incorrecto. Intentá de nuevo.'];
        }
        $otp->update(['used_at' => now()]);
        return ['ok' => true];
    }

    // Login

    public function attemptLogin(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if ($user && $user->isLocked()) {
            AuditLog::record('login_bloqueado', 'failed', $email, $user->id);
            return ['ok' => false, 'status' => 429, 'message' => 'Cuenta bloqueada. Intentá en 15 minutos.'];
        }

        if (!$user || !Hash::check($password, $user->password)) {
            if ($user) {
                $user->incrementLoginAttempts();
                $remaining = max(0, 5 - $user->login_attempts);
                AuditLog::record('login_fallido', 'failed', $email, $user->id, ['intentos_restantes' => $remaining]);
                if ($user->isLocked())
                    return ['ok' => false, 'status' => 429, 'message' => 'Cuenta bloqueada por 5 intentos fallidos. Intentá en 15 minutos.'];
                return ['ok' => false, 'status' => 401, 'message' => 'Correo o contraseña incorrectos', 'intentos_restantes' => $remaining];
            }
            AuditLog::record('login_fallido', 'failed', $email);
            return ['ok' => false, 'status' => 401, 'message' => 'Correo o contraseña incorrectos'];
        }

        $user->resetLoginAttempts();
        return ['ok' => true, 'user' => $user];
    }

    // Password

    public function changePassword(string $email, string $newPassword): bool
    {
        $user = User::where('email', $email)->first();
        if (!$user) return false;

        $user->update([
            'password'              => Hash::make($newPassword),
            'is_temporary_password' => false,
            'login_attempts'        => 0,
            'locked_until'          => null,
        ]);

        AuditLog::record('password_changed', 'success', $user->email, $user->id);
        return true;
    }

    // Registro

    public function createAccount(string $email, string $password): User
    {
        $user = User::create([
            'email'                 => $email,
            'password'              => Hash::make($password),
            'role'                  => 'client',
            'user_type'             => 'client',
            'is_temporary_password' => false,
            'email_verified_at'     => now(),
        ]);

        AuditLog::record('registro_completado', 'success', $email, $user->id, ['user_type' => 'client']);
        return $user;
    }

    public function otpRegistroVerificado(string $email): bool
    {
        return OtpCode::where('email', $email)
            ->where('type', 'registro')
            ->whereNotNull('used_at')
            ->where('used_at', '>=', now()->subMinutes(10))
            ->exists();
    }
}