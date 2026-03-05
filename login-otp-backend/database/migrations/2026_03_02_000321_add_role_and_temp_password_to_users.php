<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'employee'])->default('employee')->after('name');
            $table->boolean('is_temporary_password')->default(false)->after('password');
            $table->unsignedTinyInteger('login_attempts')->default(0)->after('is_temporary_password');
            $table->timestamp('locked_until')->nullable()->after('login_attempts');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'is_temporary_password', 'login_attempts', 'locked_until']);
        });
    }
};