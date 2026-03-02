<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\RrhhAuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    // GET /api/employees
    public function index(Request $request)
    {
        $employees = Employee::with('user')
            ->ofType($request->type)
            ->ofStatus($request->status)
            ->get()
            ->map(fn($e) => $e->toFrontend());

        return response()->json($employees);
    }

    // GET /api/employees/stats
    public function stats()
    {
        $all = Employee::all();

        return response()->json([
            'total'           => $all->count(),
            'instructores'    => $all->where('type', 'Instructor')->count(),
            'desarrolladores' => $all->where('type', 'Desarrollador')->count(),
            'administradores' => $all->where('type', 'Administrador')->count(),
            'asistentes'      => $all->where('type', 'Asistente Administrativo')->count(),
        ]);
    }

    // POST /api/employees
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'phone'      => 'nullable|string|max:20',
            'type'       => 'required|in:Instructor,Desarrollador,Administrador,Asistente Administrativo',
            'department' => 'nullable|string|max:255',
            'position'   => 'nullable|string|max:255',
            'status'     => 'nullable|in:Activo,Inactivo,Bloqueado',
            'hireDate'   => 'nullable|date',
            'specialty'  => 'nullable|string|max:255',
            'experience' => 'nullable|integer|min:0|max:50',
            'education'  => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        // Verificar email duplicado
        if (User::where('email', $request->email)->exists()) {
            $admin = User::where('role', 'admin')->first();

            RrhhAuditLog::record(
                empleadoNombre: $request->name,
                correoEmpleado: $request->email,
                admin: $admin
            );

            AuditLog::record(
                action: 'employee_duplicate_attempt',
                status: 'failed',
                email: $request->email,
                details: ['nombre_intento' => $request->name]
            );

            return response()->json(['message' => 'Este correo ya está registrado'], 409);
        }

        // Generar contraseña temporal segura
        $tempPassword = $this->generateTempPassword();

        // Crear usuario de autenticación
        $user = User::create([
            'name'                  => $request->name,
            'email'                 => $request->email,
            'password'              => Hash::make($tempPassword),
            'role'                  => 'employee',
            'is_temporary_password' => true,
            'email_verified_at'     => now(),
        ]);

        // Crear perfil de empleado
        $employee = Employee::create([
            'user_id'    => $user->id,
            'name'       => $request->name,
            'phone'      => $request->phone,
            'type'       => $request->type,
            'department' => $request->department,
            'position'   => $request->position,
            'status'     => $request->status ?? 'Activo',
            'hire_date'  => $request->hireDate,
            'specialty'  => $request->specialty,
            'experience' => is_numeric($request->experience) ? (int)$request->experience : 0,
            'education'  => $request->education,
        ]);

        // Enviar correo con credenciales
        $this->sendWelcomeEmail($user->email, $user->name, $tempPassword);

        AuditLog::record(
            action: 'employee_created',
            status: 'success',
            email: $user->email,
            userId: $user->id,
            details: ['type' => $request->type]
        );

        return response()->json([
            'employee'     => $employee->load('user')->toFrontend(),
            'tempPassword' => $tempPassword,
        ], 201);
    }

    // GET /api/employees/{id}
    public function show(int $id)
    {
        $employee = Employee::with('user')->findOrFail($id);
        return response()->json($employee->toFrontend());
    }

    // PUT /api/employees/{id}
    public function update(Request $request, int $id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'       => 'sometimes|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'type'       => 'sometimes|in:Instructor,Desarrollador,Administrador,Asistente Administrativo',
            'department' => 'nullable|string|max:255',
            'position'   => 'nullable|string|max:255',
            'status'     => 'nullable|in:Activo,Inactivo,Bloqueado',
            'hireDate'   => 'nullable|date',
            'specialty'  => 'nullable|string|max:255',
            'experience' => 'nullable|integer|min:0|max:50',
            'education'  => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $employee->update([
            'name'       => $request->name       ?? $employee->name,
            'phone'      => $request->phone      ?? $employee->phone,
            'type'       => $request->type       ?? $employee->type,
            'department' => $request->department ?? $employee->department,
            'position'   => $request->position   ?? $employee->position,
            'status'     => $request->status     ?? $employee->status,
            'hire_date'  => $request->hireDate   ?? $employee->hire_date,
            'specialty'  => $request->specialty  ?? $employee->specialty,
            'experience' => $request->experience ?? $employee->experience,
            'education'  => $request->education  ?? $employee->education,
        ]);

        // Actualizar nombre en user también
        if ($request->name) {
            $employee->user->update(['name' => $request->name]);
        }

        AuditLog::record('employee_updated', 'success', $employee->user->email, $employee->user_id);

        return response()->json($employee->fresh('user')->toFrontend());
    }

    // PATCH /api/employees/{id}/block 
    public function toggleBlock(int $id)
    {
        $employee = Employee::with('user')->findOrFail($id);
        $newStatus = $employee->status === 'Bloqueado' ? 'Activo' : 'Bloqueado';

        $employee->update(['status' => $newStatus]);
        $employee->user->update([
            'locked_until' => $newStatus === 'Bloqueado' ? now()->addYears(10) : null,
        ]);

        AuditLog::record(
            action: $newStatus === 'Bloqueado' ? 'employee_blocked' : 'employee_unblocked',
            status: 'success',
            email: $employee->user->email,
            userId: $employee->user_id
        );

        return response()->json(['status' => $newStatus]);
    }

    // DELETE /api/employees/{id}
    public function destroy(int $id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        AuditLog::record('employee_deleted', 'success', $employee->user->email, $employee->user_id);

        $employee->delete(); // SoftDelete

        return response()->json(['message' => 'Empleado eliminado correctamente']);
    }

    // Helpers privados

    private function generateTempPassword(): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
        $password = '';
        for ($i = 0; $i < 10; $i++) {
            $password .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $password;
    }

    private function sendWelcomeEmail(string $email, string $name, string $tempPassword): void
    {
        $body = "Hola $name,\n\n"
            . "Tu cuenta ha sido creada en el sistema.\n\n"
            . "Credenciales de acceso:\n"
            . "  Correo: $email\n"
            . "  Contraseña temporal: $tempPassword\n\n"
            . "Al iniciar sesión, se te pedirá que cambies tu contraseña por una nueva.\n"
            . "No se te enviará código OTP en tu primer ingreso.\n\n"
            . "Saludos,\nEl equipo de administración";

        Mail::raw($body, function ($message) use ($email, $name) {
            $message->to($email, $name)->subject('Bienvenido — Tus credenciales de acceso');
        });
    }
}