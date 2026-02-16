<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class Otp
{
    public static function generate(): string
    {
        return (string) random_int(100000, 999999);
    }

    public static function store(string $email, string $otp, int $ttlSeconds = 120): void
    {
        $expiresAt = now()->addSeconds($ttlSeconds);

        Cache::put(self::cacheKey($email), [
            'otp' => Hash::make($otp),
            'attempts' => 0,
            'expires_at' => $expiresAt->toIso8601String(),
        ], $expiresAt);
    }

    public static function verify(string $email, string $inputOtp, int $maxAttempts = 5): string
    {
        $payload = Cache::get(self::cacheKey($email));

        if (! $payload) {
            return 'expired';
        }

        $expiresAt = Carbon::parse($payload['expires_at']);

        if (now()->greaterThan($expiresAt)) {
            Cache::forget(self::cacheKey($email));
            return 'expired';
        }

        if (($payload['attempts'] ?? 0) >= $maxAttempts) {
            return 'blocked';
        }

        if (Hash::check($inputOtp, $payload['otp'])) {
            Cache::forget(self::cacheKey($email));
            return 'valid';
        }

        $payload['attempts'] = ($payload['attempts'] ?? 0) + 1;
        Cache::put(self::cacheKey($email), $payload, $expiresAt);

        return 'invalid';
    }

    public static function clear(string $email): void
    {
        Cache::forget(self::cacheKey($email));
    }

    protected static function cacheKey(string $email): string
    {
        return 'otp:'.mb_strtolower(trim($email));
    }
}
