<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('user_type', ['admin', 'employee', 'client'])
                  ->default('client')
                  ->after('role');

            $table->enum('role', [
                'admin',
                'client',
                'Instructor',
                'Desarrollador',
                'Administrador',
                'Asistente Administrativo',
            ])->default('client')->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('user_type');

            $table->enum('role', ['admin', 'employee'])
                  ->default('employee')
                  ->change();
        });
    }
};