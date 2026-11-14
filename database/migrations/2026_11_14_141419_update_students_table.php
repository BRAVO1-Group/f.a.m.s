<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropUnique(['email']);
            $table->dropColumn(['name', 'email']);

            $table->foreignId('user_id')
                ->unique()
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('program_id')
                ->after('user_id')
                ->constrained()
                ->restrictOnDelete();

            $table->string('student_number')->unique()->after('program_id');

            $table->unsignedTinyInteger('year_of_study')->after('phone');

            $table->string('status')->default('active')->after('year_of_study');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['program_id']);

            $table->dropUnique(['user_id']);
            $table->dropUnique(['student_number']);

            $table->dropColumn([
                'user_id',
                'program_id',
                'student_number',
                'year_of_study',
                'status',
            ]);

            $table->string('name')->nullable();
            $table->string('email')->nullable()->unique();
        });
    }
};