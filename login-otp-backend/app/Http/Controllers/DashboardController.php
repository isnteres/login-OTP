<?php

namespace App\Http\Controllers;

use App\Services\CourseService;

class DashboardController extends Controller
{
    public function __construct(private CourseService $courseService) {}

    // GET /api/dashboard/stats
    public function stats()
    {
        return response()->json($this->courseService->getDashboardStats());
    }
}