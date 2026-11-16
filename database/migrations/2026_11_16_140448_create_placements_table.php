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
        Schema::create('placements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('organization_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('supervisor_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->date('start_date');
            $table->date('end_date');

            $table->string('status')->default('pending');

            $table->text('description')->nullable();

            $table->timestamps();

            $table->index(['student_id', 'status']);
            $table->index(['organization_id', 'status']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placements');
    }
};
