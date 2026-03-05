<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();

            $table->string('page');
            $table->string('session_id', 64)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            // Dispositivo detectado del user_agent
            $table->enum('device_type', ['desktop', 'mobile', 'tablet'])->default('desktop');

            $table->timestamp('visited_at')->useCurrent();
            $table->timestamps();

            // Índices para que las queries de analítica sean rápidas
            $table->index('page');
            $table->index('visited_at');
            $table->index('session_id');
            $table->index('device_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};