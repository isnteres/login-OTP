<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE courses MODIFY thumbnail_url VARCHAR(1000) NULL');
            DB::statement('ALTER TABLE courses MODIFY preview_url VARCHAR(1000) NULL');
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE courses MODIFY thumbnail_url VARCHAR(255) NULL');
            DB::statement('ALTER TABLE courses MODIFY preview_url VARCHAR(255) NULL');
        }
    }
};
