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
    Schema::create('rrhh_audit_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('admin_user_id')->constrained('users')->cascadeOnDelete();
        $table->string('admin_nombre', 150);
        $table->string('admin_correo', 191);
        $table->foreignId('employee_user_id')->nullable()->constrained('users')->nullOnDelete();
        $table->string('empleado_nombre', 150);
        $table->string('correo_empleado', 191);
        $table->enum('accion', ['crear','editar','desactivar','activar','eliminar','reset_password']);
        $table->json('detalle')->nullable();
        $table->boolean('es_duplicado')->default(false);
        $table->string('ip_address', 45)->nullable();
        $table->timestamp('created_at')->useCurrent();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rrhh_audit_logs');
    }
};
