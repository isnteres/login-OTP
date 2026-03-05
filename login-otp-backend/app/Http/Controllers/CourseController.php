<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function __construct(private CourseService $service) {}

    private function validate_(Request $request, array $rules)
    {
        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) abort(response()->json(['message' => $v->errors()->first()], 422));
    }

    // GET /api/courses — público (vista de clientes) y privado (admin)
    public function index(Request $request)
    {
        $onlyActive = !$request->boolean('all');   // por defecto solo activos
        return response()->json(
            $this->service->getAll($request->category, $request->level, $onlyActive)
        );
    }

    // GET /api/courses/stats/sales — tab Ventas del dashboard
    public function salesStats()
    {
        return response()->json($this->service->getSalesStats());
    }

    // GET /api/courses/{id}
    public function show(int $id)
    {
        return response()->json($this->service->getById($id));
    }

    // POST /api/courses
    public function store(Request $request)
    {
        $this->validate_($request, [
            'title'    => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'level'    => 'nullable|in:Básico,Intermedio,Avanzado',
            'price'    => 'nullable|numeric|min:0',
        ]);

        // TODO: inyectar admin autenticado cuando se implemente auth middleware
        $adminId = 1;

        $course = $this->service->create($request->all(), $adminId);
        return response()->json($course->toFrontend(), 201);
    }

    // PUT /api/courses/{id}
    public function update(Request $request, int $id)
    {
        $this->validate_($request, [
            'title'    => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'level'    => 'nullable|in:Básico,Intermedio,Avanzado',
            'price'    => 'nullable|numeric|min:0',
        ]);

        $adminId = 1; 
        $course  = Course::findOrFail($id);
        return response()->json($this->service->update($course, $request->all(), $adminId)->toFrontend());
    }

    // PATCH /api/courses/{id}/toggle
    public function toggleActive(int $id)
    {
        $adminId  = 1;
        $course   = Course::findOrFail($id);
        $newState = $this->service->toggleActive($course, $adminId);
        return response()->json(['isActive' => $newState]);
    }
}