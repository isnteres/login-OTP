<?php

namespace App\Http\Controllers;

use App\Services\HrDiagnosticsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HrDiagnosticsController extends Controller
{
    protected $diagnosticsService;

    public function __construct(HrDiagnosticsService $diagnosticsService)
    {
        $this->diagnosticsService = $diagnosticsService;
    }

    public function __invoke(Request $request): JsonResponse
    {
        $results = $this->diagnosticsService->checkAll();

        return response()->json($results);
    }
}
