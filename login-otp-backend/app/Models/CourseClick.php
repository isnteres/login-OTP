<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseClick extends Model
{
    protected $table = 'course_clicks';

    protected $fillable = [
        'course_id',
        'tipo_evento',
        'seccion',
        'session_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}