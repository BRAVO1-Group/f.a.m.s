<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Logbook extends Model
{
    protected $fillable = [
        'placement_id',
        'log_date',
        'title',
        'activities',
        'skills_learned',
        'tools_used',
        'challenges',
        'solutions',
        'hours_worked',
        'arrival_time',
        'departure_time',
        'status',
        'supervisor_feedback',
        'submitted_at',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'hours_worked' => 'decimal:2',
            'tools_used' => 'array',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function placement(): BelongsTo
    {
        return $this->belongsTo(Placement::class);
    }
}
