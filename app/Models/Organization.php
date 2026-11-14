<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
   protected $fillable = [
        'name',
        'registration_number',
        'industry',
        'email',
        'phone',
        'website',
        'address',
        'status',
    ];

    public function supervisors(): HasMany
    {
        return $this->hasMany(Supervisor::class);
    }
}
