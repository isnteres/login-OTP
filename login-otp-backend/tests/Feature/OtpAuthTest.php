<?php

namespace Tests\Feature;

use Illuminate\Support\Carbon;
use Tests\TestCase;

class OtpAuthTest extends TestCase
{
    public function test_can_send_and_verify_otp(): void
    {
        $sendResponse = $this->postJson('/api/send-otp', [
            'email' => 'user@example.com',
        ]);

        $sendResponse
            ->assertOk()
            ->assertJsonStructure(['message', 'otp']);

        $otp = $sendResponse->json('otp');

        $this->postJson('/api/verify-otp', [
            'email' => 'user@example.com',
            'otp' => $otp,
        ])->assertOk()
            ->assertJson([
                'message' => 'Login exitoso',
            ]);
    }

    public function test_rejects_invalid_otp(): void
    {
        $this->postJson('/api/send-otp', [
            'email' => 'user@example.com',
        ])->assertOk();

        $this->postJson('/api/verify-otp', [
            'email' => 'user@example.com',
            'otp' => '111111',
        ])->assertStatus(401)
            ->assertJson([
                'message' => 'OTP incorrecto',
            ]);
    }

    public function test_rejects_expired_otp(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-16 12:00:00'));

        $sendResponse = $this->postJson('/api/send-otp', [
            'email' => 'user@example.com',
        ]);

        $sendResponse->assertOk();
        $otp = $sendResponse->json('otp');

        Carbon::setTestNow(Carbon::parse('2026-02-16 12:03:00'));

        $this->postJson('/api/verify-otp', [
            'email' => 'user@example.com',
            'otp' => $otp,
        ])->assertStatus(401)
            ->assertJson([
                'message' => 'OTP expirado',
            ]);

        Carbon::setTestNow();
    }
}
