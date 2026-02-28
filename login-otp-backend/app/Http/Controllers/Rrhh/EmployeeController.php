<?php

namespace App\Http\Controllers\Rrhh;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Models\RrhhAuditLog;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(
        private EmployeeService $employeeService
    ) {}

    // GET /api/employees
    public function index(Request $request)
    {
        $query = Employee::with('user')
            ->whereHas('user', fn($q) => $q->where('status', '!=', 'eliminado'));

        // Filtro búsqueda
        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            })->orWhere('position', 'like', "%{$request->search}%");
        }

        // Filtro tipo
        if ($request->type && $request->type !== 'todos') {
            $query->where('type', $request->type);
        }

        // Filtro status
        if ($request->status && $request->status !== 'todos') {
            $query->whereHas('user', fn($q) => $q->where('status', $request->status));
        }

        $employees = $query->paginate(15);

        // Formatea respuesta igual a como espera el frontend
        $data = $employees->map(function ($emp) {
            return [
                'id'         => $emp->id,
                'name'       => $emp->user->name,
                'email'      => $emp->user->email,
                'type'       => $emp->type,
                'position'   => $emp->position,
                'department' => $emp->department,
                'status'     => ucfirst($emp->user->status),
                'hire_date'  => $emp->hire_date,
                'phone'      => $emp->phone,
                'specialty'  => $emp->specialty,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $data,
            'meta'   => [
                'total'        => $employees->total(),
                'per_page'     => $employees->perPage(),
                'current_page' => $employees->currentPage(),
            ],
        ]);
    }

    // POST /api/employees
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'type'  => 'required|string',
        ]);

        // Verifica duplicado y registra intento en auditoría RRHH
        $existe = User::where('email', $request->email)->exists();
        if ($existe) {
            RrhhAuditLog::create([
                'admin_user_id'  => $request->user()->id,
                'admin_nombre'   => $request->user()->name,
                'admin_correo'   => $request->user()->email,
                'empleado_nombre' => $request->name,
                'correo_empleado' => $request->email,
                'accion'         => 'crear',
                'es_duplicado'   => true,
                'ip_address'     => $request->ip(),
            ]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Ya existe un usuario con ese correo',
            ], 422);
        }

        $employee = $this->employeeService->create($request->all(), $request->user());

        return response()->json([
            'status'  => 'success',
            'message' => 'Empleado creado correctamente',
            'data'    => $employee,
        ], 201);
    }

    // GET /api/employees/{id}
    public function show($id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $employee,
        ]);
    }

    // PUT /api/employees/{id}
    public function update(Request $request, $id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        $oldValues = $employee->toArray();

        $employee->update([
            'phone'            => $request->phone,
            'type'             => $request->type,
            'department'       => $request->department,
            'position'         => $request->position,
            'hire_date'        => $request->hireDate,
            'specialty'        => $request->specialty,
            'experience_years' => $request->experience ?? 0,
            'education_level'  => $request->education,
        ]);

        // Actualiza nombre si cambió
        if ($request->name) {
            $employee->user->update(['name' => $request->name]);
        }

        RrhhAuditLog::create([
            'admin_user_id'    => $request->user()->id,
            'admin_nombre'     => $request->user()->name,
            'admin_correo'     => $request->user()->email,
            'employee_user_id' => $employee->user_id,
            'empleado_nombre'  => $employee->user->name,
            'correo_empleado'  => $employee->user->email,
            'accion'           => 'editar',
            'detalle'          => ['old' => $oldValues, 'new' => $request->all()],
            'ip_address'       => $request->ip(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Empleado actualizado correctamente',
        ]);
    }

    // PATCH /api/employees/{id}/status
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:activo,inactivo,bloqueado',
        ]);

        $employee = Employee::with('user')->findOrFail($id);
        $employee->user->update(['status' => $request->status]);

        RrhhAuditLog::create([
            'admin_user_id'    => $request->user()->id,
            'admin_nombre'     => $request->user()->name,
            'admin_correo'     => $request->user()->email,
            'employee_user_id' => $employee->user_id,
            'empleado_nombre'  => $employee->user->name,
            'correo_empleado'  => $employee->user->email,
            'accion'           => $request->status === 'activo' ? 'activar' : 'desactivar',
            'ip_address'       => $request->ip(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Estado actualizado correctamente',
        ]);
    }

    // DELETE /api/employees/{id}
    public function destroy(Request $request, $id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        RrhhAuditLog::create([
            'admin_user_id'    => $request->user()->id,
            'admin_nombre'     => $request->user()->name,
            'admin_correo'     => $request->user()->email,
            'employee_user_id' => $employee->user_id,
            'empleado_nombre'  => $employee->user->name,
            'correo_empleado'  => $employee->user->email,
            'accion'           => 'eliminar',
            'ip_address'       => $request->ip(),
        ]);

        $employee->user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Empleado eliminado correctamente',
        ]);
    }
}