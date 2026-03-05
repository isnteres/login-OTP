<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            
            // Relación con User
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            
            // Información de empleado
            $table->string('employee_code')->unique();
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('employee_type_id')->constrained('employee_types');
            $table->foreignId('position_id')->constrained('positions');
            
            // Auditoría
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            
            // ⭐ SOFT DELETES - Clave para auditoría
            // Agrega 'deleted_at' para registros "eliminados" (sin borrar físicamente)
            $table->softDeletes();
            
            $table->timestamps();
            
            // Índices para performance
            $table->index('user_id');
            $table->index('department_id');
            $table->index(['employee_type_id', 'position_id']);
            $table->index('deleted_at'); // Importante para soft deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
