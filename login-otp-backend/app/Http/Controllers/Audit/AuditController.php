<?php

namespace App\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    // GET /api/audit/general
    public function index(Request $request)
    {
        $query = AuditLog::with('user')->latest('created_at');

        if ($request->search) {
            $query->where('action', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        $logs = $query->with('user')->paginate(50);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    // GET /api/audit/summary
    public function summary()
    {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'total_usuarios'        => User::count(),
                'total_eventos'         => AuditLog::count(),
                'logins_exitosos'       => AuditLog::where('action', 'login_success')->count(),
                'logins_fallidos'       => AuditLog::where('action', 'login_failed')->count(),
                'otps_fallidos'         => AuditLog::where('action', 'otp_failed')->count(),
                'registros_completados' => AuditLog::where('action', 'first_login')->count(),
            ],
        ]);
    }

    // GET /api/audit/analytics
    public function analytics(Request $request)
    {
        $period = $request->period ?? '7d';

        $days = match($period) {
            '30d'  => 30,
            'mes'  => now()->daysInMonth,
            default => 7,
        };

        // Tráfico por día — logins y visitas al dashboard
        $traffic = collect();
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('d/m');
            $fullDate = now()->subDays($i)->toDateString();

            $vistas   = AuditLog::whereDate('created_at', $fullDate)->count();
            $sesiones = AuditLog::whereDate('created_at', $fullDate)
                ->where('action', 'login_success')->count();

            $traffic->push([
                'date'     => $date,
                'vistas'   => $vistas,
                'sesiones' => $sesiones,
            ]);
        }

        // Top páginas — basado en acciones
        $topPages = [
            ['page' => 'Inicio',         'visits' => AuditLog::where('action', 'like', '%login%')->count()],
            ['page' => 'Dashboard',      'visits' => AuditLog::where('action', 'login_success')->count()],
            ['page' => 'RRHH',           'visits' => AuditLog::where('entity_type', 'Employee')->count()],
            ['page' => 'Analítica Web',  'visits' => AuditLog::where('action', 'otp_sent')->count()],
            ['page' => 'Auditoría',      'visits' => AuditLog::where('action', 'login_failed')->count()],
            ['page' => 'RRHH/Auditoría', 'visits' => AuditLog::where('action', 'password_created')->count()],
        ];

        // Dispositivos — basado en user_agent
        $desktop = AuditLog::where('user_agent', 'not like', '%Mobile%')->count();
        $mobile  = AuditLog::where('user_agent', 'like', '%Mobile%')->count();
        $total   = $desktop + $mobile ?: 1;

        $devices = [
            ['name' => 'Escritorio', 'value' => $desktop, 'color' => '#6366f1'],
            ['name' => 'Móvil',      'value' => $mobile,  'color' => '#10b981'],
        ];

        // Summary
        $summary = [
            'totalVisitas'        => AuditLog::whereBetween('created_at', [now()->subDays($days), now()])->count(),
            'sesionesUnicas'      => AuditLog::whereBetween('created_at', [now()->subDays($days), now()])
                ->where('action', 'login_success')->count(),
            'usuariosRegistrados' => User::where('is_first_login', false)->count(),
            'pagsPorSesion'       => $days > 0
                ? round(AuditLog::whereBetween('created_at', [now()->subDays($days), now()])->count() / $days, 1)
                : 0,
        ];

        return response()->json([
            'status' => 'success',
            'data'   => [
                'summary'  => $summary,
                'traffic'  => $traffic,
                'topPages' => $topPages,
                'devices'  => $devices,
            ],
        ]);
    }
}