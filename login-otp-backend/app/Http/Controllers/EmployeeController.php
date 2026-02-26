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
        
        return response()->json([
            'success' => true,
            'data' => $employees
        ], 200);
    }

    // API para guardar al nuevo empleado desde el modal
    public function store(Request $request)
    {
        // 1. Validar los datos que envía el frontend
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'employee_type_id' => 'required|exists:employee_types,id',
            'position_id' => 'required|exists:positions,id',
            'department_id' => 'required|exists:departments,id',
            'hire_date' => 'nullable|date',
            'status' => 'nullable|string'
        ]);

        // 2. Asignar una contraseña aleatoria al nuevo empleado 
        // (Como el admin lo está creando, Laravel requiere que el usuario tenga un password)
        $validated['password'] = Hash::make(Str::random(10)); 
        
        // 3. Por defecto, si no envían el estado, lo marcamos como Activo
        $validated['status'] = $validated['status'] ?? 'Activo';

        // 4. Crear el usuario en la base de datos
        $employee = User::create($validated);

        // Opcional: Aquí podrías llamar a tu modelo AuditLog para registrar que el admin creó un empleado
        
        return response()->json([
            'success' => true,
            'message' => 'Empleado registrado correctamente',
            'data' => $employee
        ], 201);
    }
}