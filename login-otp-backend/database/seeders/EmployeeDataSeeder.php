<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear Departamentos
    \App\Models\Department::create(['name' => 'Recursos Humanos']);
    
    // Crear Tipos de Empleado
    $instructor = \App\Models\EmployeeType::create(['name' => 'Instructor']);
    \App\Models\EmployeeType::create(['name' => 'Desarrollador']);

    // Crear Puestos para el Instructor
    \App\Models\Position::create([
        'name' => 'Instructor Senior',
        'employee_type_id' => $instructor->id
    ]);
    }
}
