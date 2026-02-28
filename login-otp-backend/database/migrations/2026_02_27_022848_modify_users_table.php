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
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name', 150);
        $table->string('email', 191)->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
        $table->enum('status', ['activo', 'inactivo', 'bloqueado'])->default('activo');
        $table->boolean('is_temp_password')->default(true);
        $table->boolean('is_first_login')->default(true);
        $table->timestamp('last_login_at')->nullable();
        $table->tinyInteger('failed_login_attempts')->default(0);
        $table->timestamp('locked_until')->nullable();
        $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        $table->rememberToken();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
