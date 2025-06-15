<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleMapsService;
use Illuminate\Http\Request;

/**
 * @OA\Post(
 *     path="/api/google-maps/geocode",
 *     tags={"Google Maps"},
 *     summary="Geocode an address using Google Maps API",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"address"},
 *             @OA\Property(property="address", type="string", example="123 Main St, Sydney NSW")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Geocode result", @OA\JsonContent(
 *         @OA\Property(property="lat", type="number"),
 *         @OA\Property(property="lng", type="number")
 *     )),
 *     @OA\Response(response=422, description="Unable to geocode address", @OA\JsonContent(
 *         @OA\Property(property="error", type="string")
 *     ))
 * )
 */
class GoogleMapsController extends Controller
{
    public function geocode(Request $request, GoogleMapsService $maps)
    {
        $request->validate([
            'address' => 'required|string',
        ]);
        $result = $maps->geocodeAddress($request->input('address'));
        if ($result) {
            return response()->json($result);
        }
        return response()->json(['error' => 'Unable to geocode address'], 422);
    }

    /**
     * @OA\Get(
     *     path="/api/google-maps/autocomplete",
     *     tags={"Google Maps"},
     *     summary="Get Google Places Autocomplete suggestions for an address input",
     *     @OA\Parameter(
     *         name="input",
     *         in="query",
     *         required=true,
     *         description="Partial address or place input",
     *         @OA\Schema(type="string", example="123 Main St, Syd")
     *     ),
     *     @OA\Parameter(
     *         name="location",
     *         in="query",
     *         required=false,
     *         description="Lat,lng bias (optional)",
     *         @OA\Schema(type="string", example="-33.8688,151.2093")
     *     ),
     *     @OA\Parameter(
     *         name="radius",
     *         in="query",
     *         required=false,
     *         description="Radius in meters (optional)",
     *         @OA\Schema(type="integer", example=50000)
     *     ),
     *     @OA\Response(response=200, description="Autocomplete results", @OA\JsonContent(
     *         @OA\Property(property="predictions", type="array", @OA\Items(type="object"))
     *     )),
     *     @OA\Response(response=422, description="Invalid input or API error", @OA\JsonContent(
     *         @OA\Property(property="error", type="string")
     *     ))
     * )
     */
    public function autocomplete(Request $request, GoogleMapsService $maps)
    {
        $request->validate([
            'input' => 'required|string',
        ]);
        $options = $request->only(['location', 'radius', 'types', 'components']);
        $predictions = $maps->autocomplete($request->input('input'), $options);
        if ($predictions !== null) {
            return response()->json(['predictions' => $predictions]);
        }
        return response()->json(['error' => 'Unable to fetch autocomplete suggestions'], 422);
    }
}
