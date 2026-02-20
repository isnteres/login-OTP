<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    // 1️⃣ Resumen general
    public function summary()
    {
        return response()->json([
            'total_usuarios'      => User::count(),
            'total_eventos'       => AuditLog::count(),
            'logins_exitosos'     => AuditLog::where('action', 'login_exitoso')->count(),
            'logins_fallidos'     => AuditLog::where('action', 'login_fallido')->count(),
            'otps_fallidos'       => AuditLog::where('action', 'like', '%fallido%')->count(),
            'registros_completados' => AuditLog::where('action', 'registro_completado')->count(),
        ]);
    }

    // 2️⃣ Lista de eventos
    public function logs(Request $request)
    {
        $logs = AuditLog::orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }
}