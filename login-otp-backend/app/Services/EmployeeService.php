<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\RrhhAuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class EmployeeService
{
    public function getAll(?string $type = null, ?string $status = null): array
    {
        return Employee::with('user')
            ->ofType($type)
            ->ofStatus($status)
            ->get()
            ->map(fn($e) => $e->toFrontend())
            ->toArray();
    }

    public function getStats(): array
    {
        $all = Employee::all();
        return [
            'total'           => $all->count(),
            'instructores'    => $all->where('type', 'Instructor')->count(),
            'desarrolladores' => $all->where('type', 'Desarrollador')->count(),
            'administradores' => $all->where('type', 'Administrador')->count(),
            'asistentes'      => $all->where('type', 'Asistente Administrativo')->count(),
        ];
    }

    public function create(array $data): array
    {
        // Verificar duplicado
        if (User::where('email', $data['email'])->exists()) {
            $admin = User::where('role', 'admin')->first();
            RrhhAuditLog::record($data['name'], $data['email'], $admin);
            AuditLog::record('employee_duplicate_attempt', 'failed', $data['email'], null, ['nombre_intento' => $data['name']]);
            return ['duplicate' => true];
        }

        $tempPassword = $this->generateTempPassword();

        $user = User::create([
            'name'                  => $data['name'],
            'email'                 => $data['email'],
            'password'              => Hash::make($tempPassword),
            'role'                  => 'employee',
            'is_temporary_password' => true,
            'email_verified_at'     => now(),
        ]);

        $employee = Employee::create([
            'user_id'    => $user->id,
            'name'       => $data['name'],
            'phone'      => $data['phone']      ?? null,
            'type'       => $data['type'],
            'department' => $data['department']  ?? null,
            'position'   => $data['position']    ?? null,
            'status'     => $data['status']      ?? 'Activo',
            'hire_date'  => $data['hireDate']    ?? null,
            'specialty'  => $data['specialty']   ?? null,
            'experience' => is_numeric($data['experience'] ?? '') ? (int)$data['experience'] : 0,
            'education'  => $data['education']   ?? null,
        ]);

        $this->sendWelcomeEmail($user->email, $user->name, $tempPassword);

        AuditLog::record('employee_created', 'success', $user->email, $user->id, ['type' => $data['type']]);

        return ['employee' => $employee->load('user')->toFrontend(), 'tempPassword' => $tempPassword];
    }

    public function update(Employee $employee, array $data): Employee
    {
        $employee->update([
            'name'       => $data['name']       ?? $employee->name,
            'phone'      => $data['phone']       ?? $employee->phone,
            'type'       => $data['type']        ?? $employee->type,
            'department' => $data['department']  ?? $employee->department,
            'position'   => $data['position']    ?? $employee->position,
            'status'     => $data['status']      ?? $employee->status,
            'hire_date'  => $data['hireDate']    ?? $employee->hire_date,
            'specialty'  => $data['specialty']   ?? $employee->specialty,
            'experience' => $data['experience']  ?? $employee->experience,
            'education'  => $data['education']   ?? $employee->education,
        ]);

        if (!empty($data['name'])) $employee->user->update(['name' => $data['name']]);

        AuditLog::record('employee_updated', 'success', $employee->user->email, $employee->user_id);

        return $employee->fresh('user');
    }

    public function toggleBlock(Employee $employee): string
    {
        $newStatus = $employee->status === 'Bloqueado' ? 'Activo' : 'Bloqueado';

        $employee->update(['status' => $newStatus]);
        $employee->user->update([
            'locked_until' => $newStatus === 'Bloqueado' ? now()->addYears(10) : null,
        ]);

        AuditLog::record(
            $newStatus === 'Bloqueado' ? 'employee_blocked' : 'employee_unblocked',
            'success', $employee->user->email, $employee->user_id
        );

        return $newStatus;
    }

    public function delete(Employee $employee): void
    {
        AuditLog::record('employee_deleted', 'success', $employee->user->email, $employee->user_id);
        $employee->delete();
    }

    // Helpers

    private function generateTempPassword(): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
        return implode('', array_map(
            fn() => $chars[random_int(0, strlen($chars) - 1)],
            range(1, 10)
        ));
    }

    private function sendWelcomeEmail(string $email, string $name, string $tempPassword): void
    {
        Mail::send('emails.bienvenida', compact('email', 'name', 'tempPassword'),
            fn($m) => $m->to($email, $name)->subject('Bienvenido — Tus credenciales de acceso')
        );
    }
}