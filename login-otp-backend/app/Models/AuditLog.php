<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'action',
        'status',
        'ip_address',
        'user_agent',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }

    // Método estático para registrar eventos fácilmente
    public static function record(string $action, string $status, ?string $email = null, ?int $userId = null, array $details = []): void
    {
        self::create([
            'user_id'    => $userId,
            'email'      => $email,
            'action'     => $action,
            'status'     => $status,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'details'    => $details,
        ]);
    }

    // Relación
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}