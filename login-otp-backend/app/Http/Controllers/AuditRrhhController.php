<?php

namespace App\Http\Controllers;

use App\Models\RrhhAuditLog;

class AuditRrhhController extends Controller
{
    public function index()
    {
        $records = RrhhAuditLog::orderBy('fecha_hora', 'desc')->get();

        return response()->json(
            $records->map(fn($r) => $r->toFrontend())
        );
    }
}