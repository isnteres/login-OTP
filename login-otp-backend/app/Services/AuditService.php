<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditService
{
    public function log(
        string  $action,
        int     $userId = null,
        string  $entityType = null,
        int     $entityId = null,
        array   $oldValues = null,
        array   $newValues = null,
        string  $description = null,
        Request $request = null
    ): void {
        AuditLog::create([
            'user_id'     => $userId,
            'action'      => $action,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'old_values'  => $oldValues,
            'new_values'  => $newValues,
            'ip_address'  => $request?->ip(),
            'user_agent'  => $request?->userAgent(),
            'description' => $description,
        ]);
    }
}