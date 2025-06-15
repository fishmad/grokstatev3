<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * List all addresses.
 *
 * 
 * 
 * @OA\Tag(
 *     name="Addresses",
 *     description="API endpoints for address management"
 * )
 * 
 * 
 * 
 *
 * List all addresses.
 *
 * @OA\Get(
 *     path="/api/addresses",
 *     tags={"Addresses"},
 *     summary="List all addresses",
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="List of addresses")
 * )
 *
 * Get a single address.
 *
 * @OA\Get(
 *     path="/api/addresses/{id}",
 *     tags={"Addresses"},
 *     summary="Get a single address",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Address details")
 * )
 *
 * Create a new address.
 *
 * @OA\Post(
 *     path="/api/addresses",
 *     tags={"Addresses"},
 *     summary="Create a new address",
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"property_id", "street_name", "suburb", "state", "postcode"},
 *             @OA\Property(property="property_id", type="integer"),
 *             @OA\Property(property="unit_number", type="string"),
 *             @OA\Property(property="street_number", type="string"),
 *             @OA\Property(property="street_name", type="string"),
 *             @OA\Property(property="suburb", type="string"),
 *             @OA\Property(property="state", type="string"),
 *             @OA\Property(property="postcode", type="string"),
 *             @OA\Property(property="country", type="string"),
 *             @OA\Property(property="latitude", type="number"),
 *             @OA\Property(property="longitude", type="number")
 *         )
 *     ),
 *     @OA\Response(response=201, description="Address created")
 * )
 *
 * Update an address.
 *
 * @OA\Put(
 *     path="/api/addresses/{id}",
 *     tags={"Addresses"},
 *     summary="Update an address",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="unit_number", type="string"),
 *             @OA\Property(property="street_number", type="string"),
 *             @OA\Property(property="street_name", type="string"),
 *             @OA\Property(property="suburb", type="string"),
 *             @OA\Property(property="state", type="string"),
 *             @OA\Property(property="postcode", type="string"),
 *             @OA\Property(property="country", type="string"),
 *             @OA\Property(property="latitude", type="number"),
 *             @OA\Property(property="longitude", type="number")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Address updated")
 * )
 *
 * Delete an address.
 *
 * @OA\Delete(
 *     path="/api/addresses/{id}",
 *     tags={"Addresses"},
 *     summary="Delete an address",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Address deleted")
 * )
 */

class AddressController extends Controller
{

    public function index()
    {
        $addresses = Address::paginate(20);
        return JsonResource::collection($addresses);
    }

    public function show($id)
    {
        $address = Address::findOrFail($id);
        return new JsonResource($address);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'unit_number' => 'nullable|string',
            'street_number' => 'nullable|string',
            'street_name' => 'required|string',
            'suburb' => 'required|string',
            'state' => 'required|string',
            'postcode' => 'required|string',
            'country' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $address = Address::create($data);
        return new JsonResource($address);
    }

    public function update(Request $request, $id)
    {
        $address = Address::findOrFail($id);
        $data = $request->validate([
            'unit_number' => 'nullable|string',
            'street_number' => 'nullable|string',
            'street_name' => 'sometimes|string',
            'suburb' => 'sometimes|string',
            'state' => 'sometimes|string',
            'postcode' => 'sometimes|string',
            'country' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $address->update($data);
        return new JsonResource($address);
    }

    public function destroy($id)
    {
        $address = Address::findOrFail($id);
        $address->delete();
        return response()->json(['message' => 'Address deleted']);
    }
}
