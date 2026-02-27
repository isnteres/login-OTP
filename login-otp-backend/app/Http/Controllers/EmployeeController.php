<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    // API para listar todos los empleados en la tabla principal del CRM
    public function index()
    {
        // Carga al usuario con sus relaciones (departamento, tipo y puesto)
        $employees = User::with(['department', 'employeeType', 'position'])->get();

        // Transformar para que el frontend reciba strings planos
        $data = $employees->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->name,
                'email' => $emp->email,
                'phone' => $emp->phone,
                'type' => $emp->employeeType?->name ?? 'N/A',
                'department' => $emp->department?->name ?? '—',
                'position' => $emp->position?->name ?? 'N/A',
                'status' => $emp->status,
                'hire_date' => $emp->hire_date,
                'specialty' => $emp->specialty,
                'education' => $emp->education,
                'experience' => $emp->experience,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    // API para guardar al nuevo empleado desde el modal
    public function store(Request $request)
    {
        // 1. Validar los datos que envía el frontend (adaptado a los nombres del form)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'type' => 'required|string', // Frontend envía texto
            'position' => 'required|string', // Frontend envía texto
            'department' => 'required|string', // Frontend envía texto
            'hireDate' => 'nullable|date',   // CamelCase desde React
            'status' => 'nullable|string',
            'experience' => 'nullable|integer',
            'specialty' => 'nullable|string',
            'education' => 'nullable|string',
        ]);

        // 2. Adaptador Texto -> ID (No disruptivo)
        $type = \App\Models\EmployeeType::firstOrCreate(['name' => $request->type]);
        $dept = \App\Models\Department::firstOrCreate(['name' => $request->department]);
        $pos = \App\Models\Position::firstOrCreate([
            'name' => $request->position,
            'employee_type_id' => $type->id
        ]);

        // 3. Preparar datos para el Modelo User
        $tempPassword = Str::random(10);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($tempPassword),
            'employee_type_id' => $type->id,
            'department_id' => $dept->id,
            'position_id' => $pos->id,
            'hire_date' => $request->hireDate,
            'status' => $request->status ?? 'Activo',
            'experience' => $request->experience,
            'specialty' => $request->specialty,
            'education' => $request->education,
        ];

        // 4. Crear el usuario
        $employee = User::create($userData);

        // 5. Auditoría
        \App\Models\AuditLog::record('registro_empleado_admin', 'success', $employee->email, $employee->id, [
            'admin_id' => $request->user()?->id
        ]);

        // 6. Opcional: Enviar correo (Basic raw mail)
        try {
            \Illuminate\Support\Facades\Mail::raw(
                "Bienvenido al equipo. Tu cuenta ha sido creada. \nContraseña temporal: $tempPassword \nPor favor cámbiala al ingresar.",
                function ($message) use ($employee) {
                    $message->to($employee->email)->subject('Acceso a la plataforma');
                }
            );
        } catch (\Exception $e) {
            // Log error but don't stop the flow
            \Illuminate\Support\Facades\Log::error("Error enviando correo a nuevo empleado: " . $e->getMessage());
        }

        // 7. Respuesta compatible con React
        return response()->json([
            'success' => true,
            'message' => 'Empleado registrado correctamente',
            'employee' => $employee->load(['department', 'employeeType', 'position']),
            'tempPassword' => $tempPassword // Requerido por AddEmployeeModal.jsx
        ], 201);
    }
}