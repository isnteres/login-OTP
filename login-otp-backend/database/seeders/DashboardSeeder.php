<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DashboardSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Asegurarse de que existan cursos ───────────────────────────────
        if (Course::count() === 0) {
            $this->call(CourseSeeder::class);
        }

        $courses = Course::all();

        // ── 2. Crear 20 clientes ──────────────────────────────────────────────
        $nombres = [
            'Ana García',     'Carlos López',   'Sofía Martínez', 'Diego Torres',
            'Valentina Ruiz', 'Andrés Flores',  'Camila Herrera', 'Luis Mendoza',
            'Isabella Díaz',  'Mateo Vargas',   'Luciana Castro', 'Sebastián Mora',
            'Gabriela Reyes', 'Joaquín Salas',  'Mariana Jiménez','Felipe Guerrero',
            'Natalia Ortega', 'Rodrigo Peña',   'Daniela Romero', 'Tomás Aguilar',
        ];

        $clients = [];
        foreach ($nombres as $i => $nombre) {
            $email = 'cliente' . ($i + 1) . '@gmail.com';
            $user  = User::firstOrCreate(
                ['email' => $email],
                [
                    'name'                  => $nombre,
                    'password'              => Hash::make('Test1234!'),
                    'role'                  => 'client',
                    'user_type'             => 'client',
                    'is_temporary_password' => false,
                    'email_verified_at'     => now()->subDays(rand(1, 180)),
                ]
            );
            $clients[] = $user;
        }

        $distribucion = [5 => 4, 4 => 5, 3 => 7, 2 => 9, 1 => 10, 0 => 10];

        $inscripcionesCreadas = 0;

        foreach ($distribucion as $mesesAtras => $cantidad) {
            $inicio = Carbon::now()->subMonths($mesesAtras)->startOfMonth();
            $fin    = Carbon::now()->subMonths($mesesAtras)->endOfMonth();
            // Si es el mes actual, el tope es hoy
            if ($mesesAtras === 0) $fin = Carbon::now();

            $intentos = 0;
            $creados  = 0;

            while ($creados < $cantidad && $intentos < $cantidad * 5) {
                $intentos++;
                $client = $clients[array_rand($clients)];
                $course = $courses->random();

                // Evitar duplicado (unique constraint user_id + course_id)
                if (Enrollment::where('user_id', $client->id)->where('course_id', $course->id)->exists()) {
                    continue;
                }

                // Estado: 70% active, 30% completed
                $status     = rand(1, 10) <= 7 ? 'active' : 'completed';
                $enrolledAt = Carbon::createFromTimestamp(rand($inicio->timestamp, $fin->timestamp));

                Enrollment::create([
                    'user_id'     => $client->id,
                    'course_id'   => $course->id,
                    'amount_paid' => $course->price,
                    'status'      => $status,
                    'enrolled_at' => $enrolledAt,
                ]);

                $creados++;
                $inscripcionesCreadas++;
            }
        }
    }
}