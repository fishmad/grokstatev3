<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyStoreRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PropertyResource;

/**
 * @OA\Tag(
 *     name="Properties",
 *     description="Operations about property listings"
 * )
 *
 * @OA\Get(
 *     path="/api/properties",
 *     tags={"Properties"},
 *     summary="List all properties with advanced filtering",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="status", in="query", required=false, @OA\Schema(type="string")),
 *     @OA\Parameter(name="min_price", in="query", required=false, @OA\Schema(type="number")),
 *     @OA\Parameter(name="max_price", in="query", required=false, @OA\Schema(type="number")),
 *     @OA\Parameter(name="suburb", in="query", required=false, @OA\Schema(type="string")),
 *     @OA\Parameter(name="bedrooms", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="bathrooms", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="car_spaces", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="keywords", in="query", required=false, @OA\Schema(type="string")),
 *     @OA\Parameter(name="property_type_id", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="property_classification_id", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="listing_type_id", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="authority", in="query", required=false, @OA\Schema(type="string")),
 *     @OA\Parameter(name="q", in="query", required=false, description="Full-text search for headline or description", @OA\Schema(type="string")),
 *     @OA\Parameter(name="latitude", in="query", required=false, description="Latitude for proximity search", @OA\Schema(type="number", format="float")),
 *     @OA\Parameter(name="longitude", in="query", required=false, description="Longitude for proximity search", @OA\Schema(type="number", format="float")),
 *     @OA\Parameter(name="radius", in="query", required=false, description="Radius in kilometers for proximity search", @OA\Schema(type="number", format="float")),
 *     @OA\Response(response=200, description="List of properties")
 * )
 *
 * @OA\Get(
 *     path="/api/properties/{id}",
 *     tags={"Properties"},
 *     summary="Get a single property",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Property details"),
 *     @OA\Response(response=404, description="Property not found")
 * )
 *
 * @OA\Post(
 *     path="/api/properties",
 *     tags={"Properties"},
 *     summary="Create a new property",
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"headline", "status"},
 *             @OA\Property(property="headline", type="string"),
 *             @OA\Property(property="status", type="string"),
 *             @OA\Property(property="price", type="number"),
 *             @OA\Property(property="description", type="string")
 *         )
 *     ),
 *     @OA\Response(response=201, description="Property created"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Put(
 *     path="/api/properties/{id}",
 *     tags={"Properties"},
 *     summary="Update a property",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="headline", type="string"),
 *             @OA\Property(property="status", type="string"),
 *             @OA\Property(property="price", type="number"),
 *             @OA\Property(property="description", type="string")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Property updated"),
 *     @OA\Response(response=404, description="Property not found"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Delete(
 *     path="/api/properties/{id}",
 *     tags={"Properties"},
 *     summary="Delete a property",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Property deleted"),
 *     @OA\Response(response=404, description="Property not found")
 * )
 */
class PropertyController extends Controller
{
    // List all properties with advanced filtering and eager loading
    public function index(Request $request)
    {
        $query = Property::with([
            'address',
            'propertyFeature',
            'media',
            'user', // Use 'user' for owner/agent relationship
            'listingType',
            'propertyClassification',
            'propertyType', // Use 'propertyType' if that's the correct relationship name
        ]);

        // Scalar filters
        $filterMap = [
            'status' => 'status',
            'property_type_id' => 'property_type_id',
            'property_classification_id' => 'property_classification_id',
            'listing_type_id' => 'listing_type_id',
            'authority' => 'authority',
        ];
        foreach ($filterMap as $param => $column) {
            if ($request->filled($param)) {
                $query->where($column, $request->input($param));
            }
        }
        // Price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }
        // Suburb (address relation)
        if ($request->filled('suburb')) {
            $query->whereHas('address', function ($q) use ($request) {
                $q->where('suburb', $request->input('suburb'));
            });
        }
        // Features (bedrooms, bathrooms, car_spaces, garage_spaces, parking_spaces)
        if ($request->filled('bedrooms')) {
            $query->whereHas('propertyFeature', function ($q) use ($request) {
                $q->where('bedrooms', '>=', $request->input('bedrooms'));
            });
        }
        if ($request->filled('bathrooms')) {
            $query->whereHas('propertyFeature', function ($q) use ($request) {
                $q->where('bathrooms', '>=', $request->input('bathrooms'));
            });
        }
        if ($request->filled('car_spaces')) {
            $query->whereHas('propertyFeature', function ($q) use ($request) {
                $q->where('car_spaces', '>=', $request->input('car_spaces'));
            });
        }
        if ($request->filled('garage_spaces')) {
            $query->whereHas('propertyFeature', function ($q) use ($request) {
                $q->where('garage_spaces', '>=', $request->input('garage_spaces'));
            });
        }
        if ($request->filled('parking_spaces')) {
            $query->whereHas('propertyFeature', function ($q) use ($request) {
                $q->where('parking_spaces', '>=', $request->input('parking_spaces'));
            });
        }
        // Keywords (features JSON)
        if ($request->filled('keywords')) {
            $keywords = explode(',', $request->input('keywords'));
            $query->whereHas('propertyFeature', function ($q) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $q->whereJsonContains('keywords', trim($keyword));
                }
            });
        }
        // Simple full-text search (headline, description)
        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('headline', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }
        // Geospatial search (latitude, longitude, radius in km)
        if ($request->filled(['latitude', 'longitude', 'radius'])) {
            $lat = $request->input('latitude');
            $lng = $request->input('longitude');
            $radius = $request->input('radius');
            $query->whereHas('address', function ($q) use ($lat, $lng, $radius) {
                $q->whereRaw('ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) <= ?', [
                    $lng, $lat, $radius * 1000 // convert km to meters
                ]);
            });
        }
        $properties = $query->paginate(20);
        // Log the property features and related payload for debugging
        \Log::info('Property API index payload', [
            'property_ids' => $properties->pluck('id'),
            'property_features' => $properties->pluck('propertyFeature'),
            'property_media' => $properties->pluck('media'),
        ]);
        return JsonResource::collection($properties);
    }

    // Show a single property
    public function show($id)
    {
        $property = Property::with([
            'address',
            'propertyFeature',
            'media',
            'user',
            'listingType',
            'propertyClassification',
            'propertyType',
        ])->findOrFail($id);
        // Log the property features and related payload for debugging
        \Log::info('Property API show payload', [
            'property_id' => $property->id,
            'property_feature' => $property->propertyFeature,
            'property_media' => $property->media,
        ]);
        return new PropertyResource($property);
    }

    // Create a new property (basic, for admin/agent)
    public function store(PropertyStoreRequest $request)
    {
        $property = Property::create($request->validated());
        return new JsonResource($property);
    }

    // Update a property
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $data = $request->validate([
            'status' => 'sometimes',
            'price' => 'nullable|numeric',
            'headline' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $property->update($data);
        return new JsonResource($property);
    }

    // Delete a property
    public function destroy($id)
    {
        $property = Property::findOrFail($id);
        $property->delete();
        return response()->json(['message' => 'Property deleted']);
    }
}
