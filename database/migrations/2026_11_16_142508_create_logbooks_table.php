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
        Schema::create('logbooks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('placement_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('log_date');

            $table->text('activities');
            $table->text('skills_learned')->nullable();
            $table->text('challenges')->nullable();

            $table->decimal('hours_worked', 5, 2)->default(0);

            $table->string('status')->default('draft');

            $table->timestamps();

            $table->unique(['placement_id', 'log_date']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logbooks');
    }
};
