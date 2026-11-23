<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Logbook extends Model
{
    protected $fillable = [
        'placement_id',
        'log_date',
        'activities',
        'skills_learned',
        'challenges',
        'hours_worked',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'hours_worked' => 'decimal:2',
        ];
    }

    public function placement(): BelongsTo
    {
        return $this->belongsTo(Placement::class);
    }
}
