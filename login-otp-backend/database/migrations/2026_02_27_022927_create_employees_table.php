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
        $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
        $table->string('phone', 30)->nullable();
        $table->string('type', 60);                  // Instructor, Desarrollador, etc.
        $table->string('department', 100)->nullable();
        $table->string('position', 100)->nullable();
        $table->date('hire_date')->nullable();
        $table->string('specialty', 150)->nullable();
        $table->tinyInteger('experience_years')->unsigned()->default(0);
        $table->string('education_level', 80)->nullable();
        $table->string('avatar_url', 255)->nullable();
        $table->timestamps();
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
