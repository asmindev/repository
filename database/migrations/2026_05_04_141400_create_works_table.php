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
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('work_categories')->onDelete('restrict');
            $table->foreignId('department_id')->constrained('departments')->onDelete('restrict');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');

            $table->string('title');
            $table->longText('abstract')->nullable();
            $table->json('keywords')->nullable(); // Array of keywords
            $table->integer('year')->nullable();
            $table->string('language', 10)->default('id'); // id, en
            $table->string('cover_image_path', 500)->nullable();

            // File information
            $table->string('full_file_path', 500)->nullable();
            $table->bigInteger('full_file_size')->nullable();

            // Status & Visibility
            $table->string('status')->default('draft'); // draft, pending_review, in_review, revision, approved, published, rejected
            $table->string('visibility')->default('public'); // public, restricted

            // Statistics
            $table->bigInteger('view_count')->default(0);
            $table->bigInteger('download_count')->default(0);

            // Dates
            $table->timestamp('published_at')->nullable();
            $table->timestamp('submitted_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('author_id');
            $table->index('category_id');
            $table->index('department_id');
            $table->index('status');
            $table->index('visibility');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
