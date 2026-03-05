<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();

            // Información básica
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category', 100);
            $table->enum('level', ['Básico', 'Intermedio', 'Avanzado'])->default('Básico');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('duration', 50)->nullable();  
            $table->string('instructor')->nullable();

            // Métricas
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('students_count')->default(0);
            $table->unsignedInteger('reviews_count')->default(0);

            // Multimedia
            $table->string('thumbnail_url')->nullable();
            $table->string('preview_url')->nullable();

            // Contenido
            $table->json('topics')->nullable();               // temas del curso
            $table->json('learnings')->nullable();            // puntos de aprendizaje
            $table->json('requirements')->nullable();         // requisitos previos

            // Extras
            $table->boolean('includes_certificate')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};