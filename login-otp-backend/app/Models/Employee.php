<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'photo_url',
        'type',
        'department',
        'position',
        'status',
        'hire_date',
        'specialty',
        'experience',
        'education',
    ];

    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
        ];
    }

    // Relaciones

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope para filtros

    public function scopeOfType($query, $type)
    {
        return $query->when($type && $type !== 'todos', fn($q) => $q->where('type', $type));
    }

    public function scopeOfStatus($query, $status)
    {
        return $query->when($status && $status !== 'todos', fn($q) => $q->where('status', $status));
    }

    // Formato para el frontend

    public function toFrontend(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'email'       => $this->user->email,
            'phone'       => $this->phone,
            'photo_url'   => $this->photo_url,
            'type'        => $this->type,
            'department'  => $this->department,
            'position'    => $this->position,
            'status'      => $this->status,
            'hireDate'    => $this->hire_date?->format('Y-m-d'),
            'specialty'   => $this->specialty,
            'experience'  => $this->experience,
            'education'   => $this->education,
            'createdAt'   => $this->created_at->toISOString(),
        ];
    }
}