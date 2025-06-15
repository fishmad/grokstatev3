<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Services\ReaExportService;
use Illuminate\Http\Request;

/**
 * @OA\Post(
 *     path="/api/rea/export/{id}",
 *     tags={"REA Export"},
 *     summary="Export a property to REA Group (realestate.com.au) via REAXML XML",
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Export successful", @OA\JsonContent(
 *         @OA\Property(property="success", type="boolean"),
 *         @OA\Property(property="response", type="object|array|string"),
 *         @OA\Property(property="status", type="integer")
 *     )),
 *     @OA\Response(response=422, description="Validation error or missing required fields", @OA\JsonContent(
 *         @OA\Property(property="error", type="string")
 *     ))
 * )
 */
class ReaExportController extends Controller
{
    public function export($id, ReaExportService $exporter)
    {
        $property = Property::with(['address', 'agent', 'features'])->findOrFail($id);
        try {
            $result = $exporter->export($property);
            return response()->json($result, $result['status']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
