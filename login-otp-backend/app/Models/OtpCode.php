<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class OtpCode extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'email',
        'code',
        'type',
        'expires_at',
        'used_at',
        'attempts',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at'    => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    // ── Relaciones ──────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Métodos útiles ──────────────────────────

    // Verifica si el OTP sigue siendo válido
    public function isValid(): bool
    {
        return is_null($this->used_at)
            && $this->expires_at->isFuture()
            && $this->attempts < 3;
    }

    // Marca el OTP como usado
    public function markAsUsed(): void
    {
        $this->update(['used_at' => now()]);
    }

    // Incrementa los intentos fallidos
    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }
}