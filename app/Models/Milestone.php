<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Milestone extends Model
{
    protected $fillable = [
        'placement_id',
        'student_id',
        'created_by',
        'phase',
        'title',
        'description',
        'target_week',
        'status',
        'skills',
        'tasks',
        'supervisor_feedback',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'tasks' => 'array',
            'completed_at' => 'datetime',
        ];
    }

    public function placement(): BelongsTo
    {
        return $this->belongsTo(Placement::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
