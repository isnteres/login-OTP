<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $table = 'course_enrollments';

    protected $fillable = [
        'user_id',
        'course_id',
        'amount_paid',
        'status',
        'enrolled_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_paid' => 'decimal:2',
            'enrolled_at' => 'datetime',
        ];
    }

    // Relaciones

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}