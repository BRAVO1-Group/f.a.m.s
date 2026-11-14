<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    //
     protected $fillable =[
        'name',
        'description',
        'category',
        'slug'
    ];

    public function permissions(){
        return $this->belongsToMany(permission::class)-> withTimestamps();
    }

    public function users(){
        return $this->belongsToMany(User::class)-> withTimestamps();
    }
}
