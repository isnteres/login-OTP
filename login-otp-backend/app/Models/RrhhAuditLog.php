<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RrhhAuditLog extends Model
{
    protected $table = 'rrhh_audit_logs';

    protected $fillable = [
        'empleado_duplicado',
        'correo_empleado',
        'admin_id',
        'admin_nombre',
        'admin_correo',
        'fecha_hora',
    ];

    protected function casts(): array
    {
        return [
            'fecha_hora' => 'datetime',
        ];
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public static function record(string $empleadoNombre, string $correoEmpleado, User $admin): void
    {
        self::create([
            'empleado_duplicado' => $empleadoNombre,
            'correo_empleado'    => $correoEmpleado,
            'admin_id'           => $admin->id,
            'admin_nombre'       => $admin->name ?? $admin->employee?->name ?? 'Admin',
            'admin_correo'       => $admin->email,
            'fecha_hora'         => now(),
        ]);
    }

    public function toFrontend(): array
    {
        return [
            'id'                 => $this->id,
            'fechaHora'          => $this->fecha_hora->toISOString(),
            'empleadoDuplicado'  => $this->empleado_duplicado,
            'correoEmpleado'     => $this->correo_empleado,
            'adminNombre'        => $this->admin_nombre,
            'adminCorreo'        => $this->admin_correo,
        ];
    }
}