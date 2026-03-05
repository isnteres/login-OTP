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
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            
            // Relación con usuario
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullableOnDelete();
            
            // Qué visitó
            $table->string('route');                // ej: '/crm/personal', '/dashboard'
            $table->string('method')->default('GET'); // GET, POST, PUT, DELETE
            
            // Detalles técnicos
            $table->string('referrer')->nullable(); // Página anterior
            $table->string('user_agent', 500)->nullable();
            $table->string('ip_address', 45)->nullable();
            
            // Segmentación
            $table->enum('device_type', ['desktop', 'mobile', 'tablet'])->nullable();
            $table->string('session_id')->nullable(); // Para agrupar visitas
            
            // Métricas
            $table->unsignedInteger('duration_ms')->default(0);
            $table->boolean('is_error')->default(false);
            
            $table->timestamps();
            
            // ⭐ ÍNDICES CRÍTICOS PARA ANALÍTICA
            // 1️⃣ Análisis por usuario
            $table->index('user_id');
            $table->index(['user_id', 'created_at']);
            
            // 2️⃣ Análisis por página
            $table->index('route');
            $table->index(['route', 'created_at']);
            
            // 3️⃣ Agrupación de sesiones
            $table->index('session_id');
            $table->index(['session_id', 'created_at']);
            
            // 4️⃣ Reportes por fecha
            $table->index('created_at');
            
            // 5️⃣ ÍNDICE COMPUESTO - El más importante para dashboards
            // Permite: obtener vistas/sesiones por usuario, por página, en período
            $table->index(['user_id', 'route', 'created_at']);
            
            // 6️⃣ Para filtros por device
            $table->index(['device_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
