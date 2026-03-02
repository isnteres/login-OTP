<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rrhh_audit_logs', function (Blueprint $table) {
            $table->id();

            // Empleado que se intentó duplicar
            $table->string('empleado_duplicado');
            $table->string('correo_empleado');
            
            // Admin que hizo el intento
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('admin_nombre');
            $table->string('admin_correo');

            $table->timestamp('fecha_hora')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rrhh_audit_logs');
    }
};