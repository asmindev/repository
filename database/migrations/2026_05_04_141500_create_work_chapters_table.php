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
        Schema::create('work_chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_id')->constrained('works')->onDelete('cascade');

            $table->string('title');
            $table->integer('chapter_number');
            $table->text('description')->nullable();

            // File information
            $table->string('file_path', 500)->nullable();
            $table->bigInteger('file_size')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('work_id');
            $table->index('chapter_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_chapters');
    }
};
