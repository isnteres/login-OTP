<?php

namespace App\Http\Controllers;

use App\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnalyticsController extends Controller
{
    /**
     * POST /api/analytics/track
     *
     * El frontend envía un ping cada vez que el usuario carga una página.
     * Se llama desde el hook useAnalyticsTracker que añadiremos al App.jsx.
     *
     * Body: { page, sessionId, userId? }
     */
    public function track(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page'      => 'required|string|max:255',
            'sessionId' => 'required|string|max:64',
            'userId'    => 'nullable|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos'], 422);
        }

        $ua = $request->userAgent() ?? '';

        PageView::create([
            'page'        => $request->page,
            'session_id'  => $request->sessionId,
            'user_id'     => $request->userId,
            'ip_address'  => $request->ip(),
            'user_agent'  => $ua,
            'device_type' => PageView::detectDevice($ua),
            'visited_at'  => now(),
        ]);

        return response()->json(['message' => 'ok']);
    }

    /**
     * GET /api/analytics?period=7d
     *
     * Devuelve todo lo que necesita el frontend:
     *  - summary: totales generales
     *  - traffic: vistas y sesiones por día
     *  - topPages: páginas más visitadas
     *  - devices: distribución por dispositivo
     *
     * period acepta: 7d | 30d | mes (mes actual)
     */
    public function index(Request $request)
    {
        $period = $request->get('period', '7d');
        $from   = $this->periodStart($period);

        $views = PageView::where('visited_at', '>=', $from)->get();

        // ── Summary ───────────────────────────────────────────────────────────
        $totalVisitas     = $views->count();
        $sesionesUnicas   = $views->pluck('session_id')->unique()->count();
        $usuariosRegistrados = $views->whereNotNull('user_id')->pluck('user_id')->unique()->count();
        $pagsPorSesion    = $sesionesUnicas > 0
            ? round($totalVisitas / $sesionesUnicas, 1)
            : 0;

        // ── Tráfico por día ───────────────────────────────────────────────────
        $traffic = $views
            ->groupBy(fn($v) => $v->visited_at->format('d/m'))
            ->map(fn($group, $date) => [
                'date'     => $date,
                'vistas'   => $group->count(),
                'sesiones' => $group->pluck('session_id')->unique()->count(),
            ])
            ->values();

        // ── Top páginas ───────────────────────────────────────────────────────
        $topPages = $views
            ->groupBy('page')
            ->map(fn($group, $page) => [
                'page'   => $page,
                'visits' => $group->count(),
            ])
            ->sortByDesc('visits')
            ->take(10)
            ->values();

        // ── Dispositivos ──────────────────────────────────────────────────────
        $deviceGroups = $views->groupBy('device_type');
        $total        = max($views->count(), 1);

        $devices = [
            ['name' => 'Escritorio', 'value' => round(($deviceGroups->get('desktop', collect())->count() / $total) * 100), 'color' => '#3b82f6'],
            ['name' => 'Móvil',      'value' => round(($deviceGroups->get('mobile',  collect())->count() / $total) * 100), 'color' => '#93c5fd'],
            ['name' => 'Tablet',     'value' => round(($deviceGroups->get('tablet',  collect())->count() / $total) * 100), 'color' => '#1d4ed8'],
        ];

        return response()->json([
            'summary'  => compact('totalVisitas', 'sesionesUnicas', 'usuariosRegistrados', 'pagsPorSesion'),
            'traffic'  => $traffic,
            'topPages' => $topPages,
            'devices'  => $devices,
        ]);
    }

    private function periodStart(string $period): \Carbon\Carbon
    {
        return match ($period) {
            '30d'   => now()->subDays(30),
            'mes'   => now()->startOfMonth(),
            default => now()->subDays(7),   // 7d
        };
    }
}