<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpCode extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'code',
        'type',
        'expires_at',
        'used_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at'    => 'datetime',
        ];
    }

    // Verifica si el código ya expiró
    public function isExpired(): bool
    {
        return now()->isAfter($this->expires_at);
    }

    // Verifica si el código ya fue usado
    public function isUsed(): bool
    {
        return !is_null($this->used_at);
    }

    // Relación
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}