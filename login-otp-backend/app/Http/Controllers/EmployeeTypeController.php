<?php

namespace App\Http\Controllers;

use App\Models\EmployeeType;
use App\Models\Position;
use Illuminate\Http\Request;

class EmployeeTypeController extends Controller
{
    // Devuelve "Instructor", "Desarrollador", etc.
    public function index()
    {
        $types = EmployeeType::all(['id', 'name']);
        
        return response()->json([
            'success' => true, 
            'data' => $types
        ]);
    }

    // Devuelve los puestos SOLO del tipo seleccionado (ej. Solo puestos de Instructor)
    public function getPositions($typeId)
    {
        $positions = Position::where('employee_type_id', $typeId)->get(['id', 'name']);
        
        return response()->json([
            'success' => true, 
            'data' => $positions
        ]);
    }
}