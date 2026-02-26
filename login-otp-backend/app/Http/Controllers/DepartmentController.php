<?php

namespace App\Http\Controllers;

// ESTA ES LA LÍNEA QUE TE FALTA (Importante):
use App\Models\Department; 
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        // Ahora Laravel ya sabrá qué es "Department"
        $departments = Department::all(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $departments
        ]);
    }
}