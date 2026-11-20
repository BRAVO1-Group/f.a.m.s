<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $fillable  =[
        'name',
        'code',
        'email',
        'phone',
        'website',
        'address',
        'country',
        'status',
    ];

    public function departments(){
        return $this->hasMany(Department::class);
    }
    public function admins()
   {
    return $this->hasMany(User::class);
    }
}
