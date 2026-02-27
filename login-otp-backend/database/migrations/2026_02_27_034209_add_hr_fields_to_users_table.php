<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->foreignId('department_id')->nullable()->after('phone')->constrained('departments');
            $table->foreignId('employee_type_id')->nullable()->after('department_id')->constrained('employee_types');
            $table->foreignId('position_id')->nullable()->after('employee_type_id')->constrained('positions');
            $table->string('status')->default('Activo')->after('position_id');
            $table->date('hire_date')->nullable()->after('status');
            $table->string('specialty')->nullable()->after('hire_date');
            $table->integer('experience')->nullable()->after('specialty');
            $table->string('education')->nullable()->after('experience');

            $table->index(['department_id', 'employee_type_id', 'position_id'], 'user_hr_indices');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['employee_type_id']);
            $table->dropForeign(['position_id']);
            $table->dropIndex('user_hr_indices');
            $table->dropColumn([
                'phone',
                'department_id',
                'employee_type_id',
                'position_id',
                'status',
                'hire_date',
                'specialty',
                'experience',
                'education'
            ]);
        });
    }
};
