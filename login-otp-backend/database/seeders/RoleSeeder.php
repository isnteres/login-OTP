<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;              // ← esto faltaba

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::insert([
            ['name' => 'admin',    'display_name' => 'Administrador', 'description' => 'Acceso total'],
            ['name' => 'rrhh',     'display_name' => 'Recursos Humanos', 'description' => 'Gestión de personal'],
            ['name' => 'empleado', 'display_name' => 'Empleado', 'description' => 'Acceso básico'],
        ]);
    }
}