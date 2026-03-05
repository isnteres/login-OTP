<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Carbon;

class CourseService
{
    // Cursos

    public function getAll(?string $category = null, ?string $level = null, bool $onlyActive = false): array
    {
        return Course::ofCategory($category)
            ->ofLevel($level)
            ->when($onlyActive, fn($q) => $q->active())
            ->orderBy('students_count', 'desc')
            ->get()
            ->map(fn($c) => $c->toFrontend())
            ->toArray();
    }

    public function getById(int $id): array
    {
        return Course::findOrFail($id)->toFrontend();
    }

    public function create(array $data, int $adminId): Course
    {
        $course = Course::create([
            'title'                => $data['title'],
            'description'          => $data['description']         ?? null,
            'category'             => $data['category'],
            'level'                => $data['level']               ?? 'Básico',
            'price'                => $data['price']               ?? 0,
            'duration'             => $data['duration']            ?? null,
            'instructor'           => $data['instructor']          ?? null,
            'thumbnail_url'        => $data['thumbnailUrl']        ?? null,
            'preview_url'          => $data['previewUrl']          ?? null,
            'topics'               => $this->parseLines($data['topics']       ?? []),
            'learnings'            => $this->parseLines($data['learnings']    ?? []),
            'requirements'         => $this->parseLines($data['requirements'] ?? []),
            'includes_certificate' => $data['includesCertificate'] ?? false,
            'is_active'            => true,
        ]);

        AuditLog::record('course_created', 'success', null, $adminId, ['course_id' => $course->id, 'title' => $course->title]);

        return $course;
    }

    public function update(Course $course, array $data, int $adminId): Course
    {
        $course->update([
            'title'                => $data['title']               ?? $course->title,
            'description'          => $data['description']         ?? $course->description,
            'category'             => $data['category']            ?? $course->category,
            'level'                => $data['level']               ?? $course->level,
            'price'                => $data['price']               ?? $course->price,
            'duration'             => $data['duration']            ?? $course->duration,
            'instructor'           => $data['instructor']          ?? $course->instructor,
            'thumbnail_url'        => $data['thumbnailUrl']        ?? $course->thumbnail_url,
            'preview_url'          => $data['previewUrl']          ?? $course->preview_url,
            'topics'               => $this->parseLines($data['topics']       ?? $course->topics),
            'learnings'            => $this->parseLines($data['learnings']    ?? $course->learnings),
            'requirements'         => $this->parseLines($data['requirements'] ?? $course->requirements),
            'includes_certificate' => $data['includesCertificate'] ?? $course->includes_certificate,
        ]);

        AuditLog::record('course_updated', 'success', null, $adminId, ['course_id' => $course->id]);

        return $course->fresh();
    }

    public function toggleActive(Course $course, int $adminId): bool
    {
        $newState = !$course->is_active;
        $course->update(['is_active' => $newState]);

        AuditLog::record(
            $newState ? 'course_activated' : 'course_deactivated',
            'success', null, $adminId, ['course_id' => $course->id, 'title' => $course->title]
        );

        return $newState;
    }

    // Stats para tab Ventas

    public function getSalesStats(): array
    {
        $enrollments = Enrollment::with('course')->get();

        $totalRevenue    = $enrollments->sum('amount_paid');
        $totalSales      = $enrollments->count();
        $activeCourses   = Course::active()->count();
        $completedSales  = $enrollments->where('status', 'completed')->count();

        // Top cursos por inscripciones
        $topCourses = Course::withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'title'            => $c->title,
                'enrollmentsCount' => $c->enrollments_count,
                'revenue'          => $c->enrollments->sum('amount_paid'),
            ]);

        // Ingresos por mes (últimos 6 meses)
        $monthlyRevenue = $this->buildMonthlyRevenue($enrollments);

        return [
            'totalRevenue'   => (float) $totalRevenue,
            'totalSales'     => $totalSales,
            'activeCourses'  => $activeCourses,
            'completedSales' => $completedSales,
            'topCourses'     => $topCourses,
            'monthlyRevenue' => $monthlyRevenue,
        ];
    }

    // Stats para Panel Inicio

    public function getDashboardStats(): array
    {
        $enrollments    = Enrollment::with('course')->get();
        $totalRevenue   = $enrollments->sum('amount_paid');
        $activeClients  = \App\Models\User::where('user_type', 'client')->count();
        $activeStudents = Enrollment::where('status', 'active')->distinct('user_id')->count('user_id');

        // Tasa de conversión: clientes que compraron / total clientes
        $clientsWithPurchase = Enrollment::distinct('user_id')->count('user_id');
        $conversionRate      = $activeClients > 0
            ? round(($clientsWithPurchase / $activeClients) * 100, 1)
            : 0;

        $topProducts = Course::withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'       => $c->id,
                'title'    => $c->title,
                'students' => $c->enrollments_count,
                'revenue'  => (float) $c->enrollments->sum('amount_paid'),
                'category' => $c->category,
            ]);

        return [
            'totalRevenue'    => (float) $totalRevenue,
            'activeClients'   => $activeClients,
            'conversionRate'  => $conversionRate,
            'activeStudents'  => $activeStudents,
            'topProducts'     => $topProducts,
            'monthlyRevenue'  => $this->buildMonthlyRevenue($enrollments),
        ];
    }

    // Helpers
    private function parseLines(mixed $value): array
    {
        if (is_array($value)) return array_filter($value);
        if (is_string($value)) return array_filter(array_map('trim', explode("\n", $value)));
        return [];
    }

    private function buildMonthlyRevenue($enrollments): array
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $key   = $month->format('Y-m');
            $label = $month->translatedFormat('M');

            $revenue = $enrollments
                ->filter(fn($e) => $e->enrolled_at->format('Y-m') === $key)
                ->sum('amount_paid');

            $months[] = ['month' => $label, 'revenue' => (float) $revenue];
        }
        return $months;
    }
}