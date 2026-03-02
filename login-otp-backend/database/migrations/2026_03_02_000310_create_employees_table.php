<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            // Relación con el usuario de autenticación
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Datos personales
            $table->string('name');
            $table->string('phone', 20)->nullable();
            $table->string('photo_url')->nullable();

            // Datos laborales
            $table->enum('type', ['Instructor', 'Desarrollador', 'Administrador', 'Asistente Administrativo']);
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->enum('status', ['Activo', 'Inactivo', 'Bloqueado'])->default('Activo');
            $table->date('hire_date')->nullable();

            // Datos profesionales
            $table->string('specialty')->nullable();
            $table->unsignedTinyInteger('experience')->default(0);
            $table->string('education')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};