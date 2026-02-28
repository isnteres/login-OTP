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
    Schema::create('otp_codes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->string('email', 191);
        $table->string('code', 255);                 // se guarda hasheado
        $table->enum('type', ['activation', 'login', 'reset']);
        $table->timestamp('expires_at');
        $table->timestamp('used_at')->nullable();
        $table->tinyInteger('attempts')->default(0);
        $table->string('ip_address', 45)->nullable();
        $table->timestamp('created_at')->useCurrent();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};
