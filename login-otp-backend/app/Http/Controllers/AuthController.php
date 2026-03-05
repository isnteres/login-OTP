<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth) {}

    private function validate_(Request $request, array $rules, string $msg = 'Datos inválidos')
    {
        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) abort(response()->json(['message' => $msg], 422));
    }

    // Login

    public function loginCredentials(Request $request)
    {
        $this->validate_($request, ['email' => 'required|email', 'password' => 'required']);

        $result = $this->auth->attemptLogin($request->email, $request->password);
        if (!$result['ok']) return response()->json($result, $result['status']);

        $user = $result['user'];

        if ($user->is_temporary_password) {
            AuditLog::record('login_temporal', 'success', $user->email, $user->id);
            return response()->json([
                'isTemporary' => true,
                'user'        => ['id' => $user->id, 'email' => $user->email, 'name' => $user->name, 'userType' => $user->user_type],
            ]);
        }

        // Clientes: login directo sin OTP
        if ($user->user_type === 'client') {
            AuditLog::record('login_exitoso', 'success', $user->email, $user->id);
            return response()->json([
                'isTemporary' => false,
                'requiresOtp' => false,
                'user'        => ['id' => $user->id, 'email' => $user->email, 'name' => $user->name, 'userType' => $user->user_type],
            ]);
        }

        // Empleados y admins: requieren OTP
        $this->auth->sendOtp($user->email, 'login', $user->id);
        AuditLog::record('login_otp_enviado', 'success', $user->email, $user->id);

        return response()->json(['isTemporary' => false, 'requiresOtp' => true, 'message' => 'Credenciales correctas, revisá tu correo']);
    }

    public function loginVerifyOtp(Request $request)
    {
        $this->validate_($request, ['email' => 'required|email', 'otp' => 'required|digits:6']);

        $email = $request->email;
        $otp   = $this->auth->findOtp($email, 'login');

        if (!$otp) {
            AuditLog::record('login_otp_fallido', 'failed', $email, null, ['razon' => 'no encontrado']);
            return response()->json(['message' => 'Código inválido'], 400);
        }

        $check = $this->auth->validateOtp($otp, $request->otp, $email, 'login_otp_fallido');
        if (!$check['ok']) return response()->json(['message' => $check['message']], $check['status']);

        $user = User::where('email', $email)->first();
        AuditLog::record('login_exitoso', 'success', $email, $user->id);

        return response()->json([
            'message' => 'Bienvenido',
            'user'    => ['id' => $user->id, 'email' => $user->email, 'name' => $user->name, 'userType' => $user->user_type],
        ]);
    }

    public function changePassword(Request $request)
    {
        $this->validate_($request, [
            'email'       => 'required|email',
            'newPassword' => ['required','min:8','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/','regex:/[!@#$%^&*]/'],
        ]);

        if (!$this->auth->changePassword($request->email, $request->newPassword))
            return response()->json(['message' => 'El correo no coincide con el registrado'], 400);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }

    // Registro

    public function registerSendOtp(Request $request)
    {
        $this->validate_($request, ['email' => 'required|email'], 'Correo inválido');

        $email = $request->email;

        if (User::where('email', $email)->exists()) {
            AuditLog::record('registro_intento', 'failed', $email, null, ['razon' => 'correo ya registrado']);
            return response()->json(['message' => 'Este correo ya está registrado'], 409);
        }

        $this->auth->sendOtp($email, 'registro');
        AuditLog::record('registro_otp_enviado', 'success', $email);

        return response()->json(['message' => 'Código enviado correctamente']);
    }

    public function registerVerifyOtp(Request $request)
    {
        $this->validate_($request, ['email' => 'required|email', 'otp' => 'required|digits:6']);

        $email = $request->email;
        $otp   = $this->auth->findOtp($email, 'registro');

        if (!$otp) {
            AuditLog::record('registro_otp_fallido', 'failed', $email, null, ['razon' => 'no encontrado']);
            return response()->json(['message' => 'Código inválido'], 400);
        }

        $check = $this->auth->validateOtp($otp, $request->otp, $email, 'registro_otp_fallido');
        if (!$check['ok']) return response()->json(['message' => $check['message']], $check['status']);

        AuditLog::record('registro_otp_verificado', 'success', $email);
        return response()->json(['message' => 'Código verificado correctamente']);
    }

    public function registerCreatePassword(Request $request)
    {
        $this->validate_($request, ['email' => 'required|email', 'password' => 'required|min:8']);

        if (!$this->auth->otpRegistroVerificado($request->email))
            return response()->json(['message' => 'Debés verificar el código OTP primero'], 403);

        $user = $this->auth->createAccount($request->email, $request->password);

        return response()->json([
            'message' => 'Cuenta creada exitosamente',
            'user'    => ['id' => $user->id, 'email' => $user->email, 'userType' => $user->user_type],
        ]);
    }
}