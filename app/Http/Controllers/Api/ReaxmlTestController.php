<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Services\ReaxmlService;
use Illuminate\Http\Request;

/**
 * @OA\Get(
 *     path="/api/reaxml/generate/{id}",
 *     tags={"REAXML"},
 *     summary="Generate REAXML XML for a property",
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="REAXML XML generated successfully", @OA\MediaType(mediaType="application/xml")),
 *     @OA\Response(response=422, description="Validation error or missing required fields", @OA\JsonContent(
 *         @OA\Property(property="error", type="string")
 *     ))
 * )
 */
class ReaxmlTestController extends Controller
{
    public function generate($id, ReaxmlService $reaxml)
    {
        $property = Property::with(['address', 'agent', 'features'])->findOrFail($id);
        try {
            $xml = $reaxml->generate($property);
            return response($xml, 200)->header('Content-Type', 'application/xml');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
