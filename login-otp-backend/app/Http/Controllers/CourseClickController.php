<?php

namespace App\Http\Controllers;

use App\Models\CourseClick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseClickController extends Controller
{
    // POST /api/course-clicks
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id'   => 'required|exists:courses,id',
            'tipo_evento' => 'required|in:click_ver,click_comprar',
            'seccion'     => 'nullable|in:catalogo,destacado',
            'session_id'  => 'nullable|string|max:64',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $click = CourseClick::create([
            'course_id'   => $request->course_id,
            'tipo_evento' => $request->tipo_evento,
            'seccion'     => $request->seccion ?? 'catalogo',
            'session_id'  => $request->session_id,
        ]);

        return response()->json($click, 201);
    }

    // GET /api/course-clicks
    public function index()
    {
        $stats = CourseClick::selectRaw('
                course_id,
                tipo_evento,
                COUNT(*) as total
            ')
            ->with('course:id,title')
            ->groupBy('course_id', 'tipo_evento')
            ->orderByDesc('total')
            ->get();

        return response()->json($stats, 200);
    }
}