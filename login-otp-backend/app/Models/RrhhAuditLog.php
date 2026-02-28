<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RrhhAuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'admin_user_id',
        'admin_nombre',
        'admin_correo',
        'employee_user_id',
        'empleado_nombre',
        'correo_empleado',
        'accion',
        'detalle',
        'es_duplicado',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'detalle'      => 'array',
            'es_duplicado' => 'boolean',
            'created_at'   => 'datetime',
        ];
    }

    // ── Relaciones ──────────────────────────────

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    public function empleado()
    {
        return $this->belongsTo(User::class, 'employee_user_id');
    }
}