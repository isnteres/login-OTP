<?php

namespace App\Services;

use App\Models\User;
use App\Models\Employee;
use App\Models\Role;
use App\Models\RrhhAuditLog;
use App\Mail\TempPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmployeeService
{
    public function create(array $data, User $adminUser): Employee
    {
        // Genera contraseña temporal segura
        $tempPassword = ucfirst(Str::random(8)) . random_int(10, 99);

        // Obtiene el rol empleado
        $rolEmpleado = Role::where('name', 'empleado')->first();

        // Crea el usuario
        $user = User::create([
            'name'             => $data['name'],
            'email'            => $data['email'],
            'password'         => bcrypt($tempPassword),
            'role_id'          => $rolEmpleado->id,
            'status'           => $data['status'] ?? 'activo',
            'is_temp_password' => true,
            'is_first_login'   => true,
            'created_by'       => $adminUser->id,
        ]);

        // Crea el perfil de empleado
        $employee = Employee::create([
            'user_id'          => $user->id,
            'phone'            => $data['phone'] ?? null,
            'type'             => $data['type'],
            'department'       => $data['department'] ?? null,
            'position'         => $data['position'] ?? null,
            'hire_date'        => $data['hireDate'] ?? null,
            'specialty'        => $data['specialty'] ?? null,
            'experience_years' => $data['experience'] ?? 0,
            'education_level'  => $data['education'] ?? null,
        ]);

        // Envía email con contraseña temporal
        Mail::to($user->email)->send(new TempPasswordMail($tempPassword, $user->name));

        // Registra en auditoría RRHH
        RrhhAuditLog::create([
            'admin_user_id'    => $adminUser->id,
            'admin_nombre'     => $adminUser->name,
            'admin_correo'     => $adminUser->email,
            'employee_user_id' => $user->id,
            'empleado_nombre'  => $user->name,
            'correo_empleado'  => $user->email,
            'accion'           => 'crear',
            'detalle'          => $data,
            'es_duplicado'     => false,
            'ip_address'       => request()->ip(),
        ]);

        return $employee;
    }
}