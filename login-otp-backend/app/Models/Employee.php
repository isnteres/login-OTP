<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'type',
        'department',
        'position',
        'hire_date',
        'specialty',
        'experience_years',
        'education_level',
        'avatar_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}