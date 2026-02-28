<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();

        User::create([
            'name'             => 'Administrador',
            'email'            => 'admin@empresa.com',
            'password'         => bcrypt('Admin1234'),
            'role_id'          => $adminRole->id,
            'status'           => 'activo',
            'is_temp_password' => false,
            'is_first_login'   => false,
        ]);
    }
}