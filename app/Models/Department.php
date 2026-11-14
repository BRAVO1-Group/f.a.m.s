<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
     protected $fillable = [
        'university_id',
        'name',
        'code',
        'description',
        'status',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }
}
