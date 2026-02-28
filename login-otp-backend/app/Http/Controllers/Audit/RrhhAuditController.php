<?php

namespace App\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Models\RrhhAuditLog;
use Illuminate\Http\Request;

class RrhhAuditController extends Controller
{
    // GET /api/audit/rrhh
    public function index(Request $request)
    {
        $query = RrhhAuditLog::with('admin', 'empleado')->latest('created_at');

        if ($request->search) {
            $query->where('empleado_nombre', 'like', "%{$request->search}%")
                  ->orWhere('correo_empleado', 'like', "%{$request->search}%")
                  ->orWhere('admin_nombre', 'like', "%{$request->search}%")
                  ->orWhere('admin_correo', 'like', "%{$request->search}%");
        }

        $logs = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    // GET /api/audit/rrhh/stats
    public function stats()
    {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'totalIntentos'      => RrhhAuditLog::count(),
                'empleadosAfectados' => RrhhAuditLog::distinct('employee_user_id')->count(),
                'adminsInvolucrados' => RrhhAuditLog::distinct('admin_user_id')->count(),
            ],
        ]);
    }
}