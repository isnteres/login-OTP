<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HrCatalogsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            "Administración",
            "Recursos Humanos",
            "Tecnología de la Información",
            "Desarrollo",
            "Educación",
            "Marketing",
            "Ventas",
            "Soporte Técnico",
            "Operaciones",
            "Finanzas"
        ];

        foreach ($departments as $name) {
            \App\Models\Department::firstOrCreate(['name' => $name]);
        }

        $types = [
            "Instructor" => [
                "Instructor Senior",
                "Instructor Junior",
                "Coordinador de Contenidos",
                "Especialista en Formación"
            ],
            "Desarrollador" => [
                "Desarrollador Senior",
                "Desarrollador Junior",
                "Analista de Sistemas",
                "Arquitecto de Software"
            ],
            "Administrador" => [
                "Jefe de RRHH",
                "Coordinador Administrativo",
                "Gerente de Operaciones"
            ],
            "Asistente Administrativo" => [
                "Asistente de RRHH",
                "Asistente Contable",
                "Soporte Técnico"
            ]
        ];

        foreach ($types as $typeName => $positions) {
            $type = \App\Models\EmployeeType::firstOrCreate(['name' => $typeName]);
            foreach ($positions as $posName) {
                \App\Models\Position::firstOrCreate([
                    'name' => $posName,
                    'employee_type_id' => $type->id
                ]);
            }
        }
    }
}
