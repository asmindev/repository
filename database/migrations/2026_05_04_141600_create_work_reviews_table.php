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
        Schema::create('work_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_id')->constrained('works')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');

            $table->string('action')->default('assigned'); // assigned, in_review, approved, rejected, revision
            $table->longText('comment')->nullable();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('work_id');
            $table->index('reviewer_id');
            $table->index('action');
            $table->index('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_reviews');
    }
};
