<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'title'       => 'Forense Digital y Análisis de Evidencias',
                'description' => 'Especializate en investigación forense digital y análisis de evidencias cibernéticas.',
                'category'    => 'Redes y Ciberseguridad',
                'level'       => 'Avanzado',
                'price'       => 210.00,
                'duration'    => '10 semanas',
                'instructor'  => 'TechSkillsPerú',
                'rating'      => 4.9,
                'students_count' => 198,
                'reviews_count'  => 198,
                'topics'      => ['EnCase', 'FTK', 'Volatility'],
                'learnings'   => ['Metodología forense digital', 'Análisis de discos y memoria', 'Recuperación de datos'],
                'requirements'=> ['Sistemas operativos avanzado', 'Conocimientos de filesystems', 'Experiencia en ciberseguridad'],
                'includes_certificate' => true,
                'is_active'   => true,
            ],
            [
                'title'       => 'Seguridad de Redes: Fundamentos y Práctica',
                'description' => 'Aprende a proteger infraestructuras de red contra amenazas modernas.',
                'category'    => 'Redes y Ciberseguridad',
                'level'       => 'Intermedio',
                'price'       => 250.00,
                'duration'    => '8 semanas',
                'instructor'  => 'TechSkillsPerú',
                'rating'      => 4.7,
                'students_count' => 389,
                'reviews_count'  => 389,
                'topics'      => ['Firewalls', 'VPN', 'IDS/IPS', 'Wireshark'],
                'learnings'   => ['Configuración de firewalls', 'Análisis de tráfico', 'Detección de intrusos'],
                'requirements'=> ['Redes básicas', 'TCP/IP'],
                'includes_certificate' => true,
                'is_active'   => true,
            ],
            [
                'title'       => 'Python: Desarrolla habilidades desde cero',
                'description' => 'Aprende Python desde los fundamentos async/await y patrones de diseño.',
                'category'    => 'Tecnología y Desarrollo',
                'level'       => 'Básico',
                'price'       => 210.00,
                'duration'    => '10 semanas',
                'instructor'  => 'TechSkillsPerú',
                'rating'      => 4.9,
                'students_count' => 723,
                'reviews_count'  => 723,
                'topics'      => ['Variables y tipos', 'POO', 'APIs REST', 'Async/Await'],
                'learnings'   => ['Programación orientada a objetos', 'Consumo de APIs', 'Automatización'],
                'requirements'=> ['Ninguno — apto para principiantes'],
                'includes_certificate' => true,
                'is_active'   => true,
            ],
            [
                'title'       => 'React y Node.js: Desarrollo Full Stack',
                'description' => 'Domina el desarrollo full stack moderno con React y Node.js desde cero.',
                'category'    => 'Tecnología y Desarrollo',
                'level'       => 'Intermedio',
                'price'       => 240.00,
                'duration'    => '10 semanas',
                'instructor'  => 'TechSkillsPerú',
                'rating'      => 4.9,
                'students_count' => 567,
                'reviews_count'  => 567,
                'topics'      => ['React Hooks', 'Node.js', 'Express', 'MongoDB', 'JWT'],
                'learnings'   => ['Componentes reutilizables', 'APIs REST con Node', 'Autenticación JWT'],
                'requirements'=> ['JavaScript básico', 'HTML y CSS'],
                'includes_certificate' => true,
                'is_active'   => true,
            ],
            [
                'title'       => 'JavaScript desde Nivel Básico a Avanzado + ES6+',
                'description' => 'Domina JavaScript moderno, async/await y patrones de diseño.',
                'category'    => 'Tecnología y Desarrollo',
                'level'       => 'Básico',
                'price'       => 193.00,
                'duration'    => '8 semanas',
                'instructor'  => 'TechSkillsPerú',
                'rating'      => 4.8,
                'students_count' => 498,
                'reviews_count'  => 498,
                'topics'      => ['ES6+', 'Promesas', 'Async/Await', 'DOM', 'Fetch API'],
                'learnings'   => ['JavaScript moderno', 'Programación asíncrona', 'Manipulación del DOM'],
                'requirements'=> ['HTML básico'],
                'includes_certificate' => true,
                'is_active'   => true,
            ],
            [
                'title'       => 'WordPress: Desarrollo y Personalización Web',
                'description' => 'Domina WordPress desde sitios básicos hasta temas y plugins personalizados.',
                'category'    => 'Tecnología y Desarrollo',
                'level'       => 'Básico',
                'price'       => 160.00,
                'duration'    => '8 semanas',
                'instructor'  => 'TechSkillsPerú',
                'rating'      => 4.6,
                'students_count' => 409,
                'reviews_count'  => 409,
                'topics'      => ['Themes', 'Plugins', 'WooCommerce', 'SEO básico'],
                'learnings'   => ['Crear sitios profesionales', 'Personalizar temas', 'Tienda online'],
                'requirements'=> ['Ninguno'],
                'includes_certificate' => false,
                'is_active'   => true,
            ],
        ];

        foreach ($courses as $data) {
            Course::create($data);
        }
    }
}