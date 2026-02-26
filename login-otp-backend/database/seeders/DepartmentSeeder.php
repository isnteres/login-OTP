<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     
    \App\Models\Department::create(['name' => 'Recursos Humanos']);
    \App\Models\Department::create(['name' => 'Soporte Técnico']);

    }
}
