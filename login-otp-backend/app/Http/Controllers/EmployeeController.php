<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function __construct(private EmployeeService $service) {}

    private function validate_(Request $request, array $rules)
    {
        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) abort(response()->json(['message' => $v->errors()->first()], 422));
    }

    public function index(Request $request)
    {
        return response()->json($this->service->getAll($request->type, $request->status));
    }

    public function stats()
    {
        return response()->json($this->service->getStats());
    }

    public function show(int $id)
    {
        return response()->json(Employee::with('user')->findOrFail($id)->toFrontend());
    }

    public function store(Request $request)
    {
        $this->validate_($request, [
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

        $result = $this->service->create($request->all());

        if ($result['duplicate'] ?? false)
            return response()->json(['message' => 'Este correo ya está registrado'], 409);

        return response()->json($result, 201);
    }

    public function update(Request $request, int $id)
    {
        $this->validate_($request, [
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

        $employee = Employee::with('user')->findOrFail($id);
        return response()->json($this->service->update($employee, $request->all())->toFrontend());
    }

    public function toggleBlock(int $id)
    {
        $employee  = Employee::with('user')->findOrFail($id);
        $newStatus = $this->service->toggleBlock($employee);
        return response()->json(['status' => $newStatus]);
    }

    public function destroy(int $id)
    {
        $this->service->delete(Employee::with('user')->findOrFail($id));
        return response()->json(['message' => 'Empleado eliminado correctamente']);
    }
}