<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('logbooks', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->json('tools_used')->nullable();
            $table->time('arrival_time')->nullable();
            $table->time('departure_time')->nullable();
            $table->text('solutions')->nullable();
            $table->text('supervisor_feedback')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('placement_id')->constrained()->cascadeOnDelete();
            $table->date('attendance_date');
            $table->timestamp('check_in');
            $table->timestamp('check_out')->nullable();
            $table->timestamps();

            $table->unique(['placement_id', 'attendance_date']);
        });

        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('placement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('phase');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('target_week');
            $table->string('status')->default('not_started');
            $table->json('skills')->nullable();
            $table->json('tasks')->nullable();
            $table->text('supervisor_feedback')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['student_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('attendances');

        Schema::table('logbooks', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn([
                'title',
                'tools_used',
                'arrival_time',
                'departure_time',
                'solutions',
                'supervisor_feedback',
                'submitted_at',
                'reviewed_by',
                'reviewed_at',
            ]);
        });
    }
};
