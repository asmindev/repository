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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nim')->nullable()->unique()->after('email'); // Nomor Induk Mahasiswa
            $table->string('nidn')->nullable()->unique()->after('nim'); // Nomor Induk Dosen Nasional
            $table->string('avatar')->nullable()->after('nidn');
            $table->unsignedBigInteger('department_id')->nullable()->after('avatar');
            $table->boolean('is_active')->default(true)->after('department_id');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nim', 'nidn', 'avatar', 'department_id', 'is_active', 'deleted_at']);
        });
    }
};
