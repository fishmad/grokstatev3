<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReaApiService;
use Illuminate\Http\JsonResponse;

class ReaTestController extends Controller
{
    public function token(ReaApiService $reaApiService): JsonResponse
    {
        try {
            $token = $reaApiService->getAccessToken();
            return response()->json(['access_token' => $token]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
