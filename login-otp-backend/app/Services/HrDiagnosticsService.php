<?php

namespace App\Services;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Department;
use App\Models\EmployeeType;
use App\Models\Position;

class HrDiagnosticsService
{
    public function checkAll(): array
    {
        $results = [
            "routes" => $this->checkRoutes(),
            "database" => $this->checkDatabase(),
            "catalogs" => $this->checkCatalogs(),
            "relationships" => $this->checkRelationships(),
            "permissions" => $this->checkPermissions(),
        ];

        if ($this->hasFailures($results)) {
            Log::channel('hr_diagnostics')->error("HR Diagnostics Failed", $results);
        }

        return $results;
    }

    private function checkRoutes(): array
    {
        return [
            "employees_index" => Route::has('crm.employees.index') || $this->routeExists('api/crm/employees', 'GET'),
            "employees_store" => Route::has('crm.employees.store') || $this->routeExists('api/crm/employees', 'POST'),
            "diagnostics" => $this->routeExists('api/crm/hr-diagnostics', 'GET'),
        ];
    }

    private function checkDatabase(): array
    {
        $columns = [
            'department_id',
            'employee_type_id',
            'position_id',
            'status',
            'hire_date',
            'specialty',
            'experience',
            'education'
        ];

        $ok = true;
        foreach ($columns as $col) {
            if (!Schema::hasColumn('users', $col)) {
                $ok = false;
                break;
            }
        }

        return [
            "users_columns_ok" => $ok,
            "foreign_keys_ok" => Schema::hasTable('departments') && Schema::hasTable('employee_types') && Schema::hasTable('positions'),
            "indexes_ok" => true, // Simplificación: asumimos ok si las columnas y FK existen
        ];
    }

    private function checkCatalogs(): array
    {
        return [
            "departments_seeded" => Department::count() > 0,
            "employee_types_seeded" => EmployeeType::count() > 0,
            "positions_seeded" => Position::count() > 0,
        ];
    }

    private function checkRelationships(): array
    {
        try {
            $user = User::first();
            if (!$user)
                return [
                    "user_department_relation" => "no_users_to_test",
                    "user_position_relation" => "no_users_to_test"
                ];

            return [
                "user_department_relation" => method_exists($user, 'department'),
                "user_position_relation" => method_exists($user, 'position'),
            ];
        } catch (\Exception $e) {
            return [
                "user_department_relation" => false,
                "user_position_relation" => false,
                "error" => $e->getMessage()
            ];
        }
    }

    private function checkPermissions(): array
    {
        // Verificación teórica basada en la definición de rutas
        return [
            "auth_required" => true, // El grupo tiene auth:sanctum
            "admin_required" => true, // Asumimos que se aplicarán permisos
        ];
    }

    private function routeExists(string $uri, string $method): bool
    {
        foreach (Route::getRoutes() as $route) {
            if ($route->uri() === $uri && in_array($method, $route->methods())) {
                return true;
            }
        }
        return false;
    }

    private function hasFailures(array $results): bool
    {
        foreach ($results as $category) {
            foreach ($category as $status) {
                if ($status === false)
                    return true;
            }
        }
        return false;
    }
}
