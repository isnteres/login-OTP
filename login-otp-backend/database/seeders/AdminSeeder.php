<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@empresa.com'],
            [
                'name'                  => 'Administrador',
                'password'              => Hash::make('Admin1234!'),
                'role'                  => 'admin',
                'is_temporary_password' => false,
                'email_verified_at'     => now(),
            ]
        );

        // Crear perfil de empleado vinculado al admin
        Employee::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name'       => 'Administrador',
                'type'       => 'Administrador',
                'department' => 'Administración',
                'position'   => 'Gerente de Operaciones',
                'status'     => 'Activo',
                'hire_date'  => now()->toDateString(),
            ]
        );

        $this->command->info('✓ Admin creado: admin@empresa.com / Admin1234!');
    }
}