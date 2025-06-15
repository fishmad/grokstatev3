<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Tag(
 *     name="Favorites",
 *     description="Operations about favorite properties"
 * )
 *
 * @OA\Get(
 *     path="/api/favorites",
 *     tags={"Favorites"},
 *     summary="List all favorites",
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="List of favorites")
 * )
 *
 * @OA\Get(
 *     path="/api/favorites/{id}",
 *     tags={"Favorites"},
 *     summary="Get a single favorite",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Favorite details"),
 *     @OA\Response(response=404, description="Favorite not found")
 * )
 *
 * @OA\Post(
 *     path="/api/favorites",
 *     tags={"Favorites"},
 *     summary="Create a new favorite",
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "property_id"},
 *             @OA\Property(property="user_id", type="integer"),
 *             @OA\Property(property="property_id", type="integer"),
 *             @OA\Property(property="notes", type="string")
 *         )
 *     ),
 *     @OA\Response(response=201, description="Favorite created"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Put(
 *     path="/api/favorites/{id}",
 *     tags={"Favorites"},
 *     summary="Update a favorite",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="notes", type="string")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Favorite updated"),
 *     @OA\Response(response=404, description="Favorite not found"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Delete(
 *     path="/api/favorites/{id}",
 *     tags={"Favorites"},
 *     summary="Delete a favorite",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Favorite deleted"),
 *     @OA\Response(response=404, description="Favorite not found")
 * )
 */

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Favorite::with(['user', 'property'])->paginate(20);
        return JsonResource::collection($favorites);
    }

    public function show($id)
    {
        $favorite = Favorite::with(['user', 'property'])->findOrFail($id);
        return new JsonResource($favorite);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'property_id' => 'required|exists:properties,id',
            'notes' => 'nullable|string',
        ]);
        $favorite = Favorite::create($data);
        return new JsonResource($favorite);
    }

    public function update(Request $request, $id)
    {
        $favorite = Favorite::findOrFail($id);
        $data = $request->validate([
            'notes' => 'nullable|string',
        ]);
        $favorite->update($data);
        return new JsonResource($favorite);
    }

    public function destroy($id)
    {
        $favorite = Favorite::findOrFail($id);
        $favorite->delete();
        return response()->json(['message' => 'Favorite deleted']);
    }
}
