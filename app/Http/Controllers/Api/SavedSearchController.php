<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedSearch;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Tag(
 *     name="SavedSearches",
 *     description="Operations about saved searches"
 * )
 *
 * @OA\Get(
 *     path="/api/saved-searches",
 *     tags={"SavedSearches"},
 *     summary="List all saved searches",
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="List of saved searches")
 * )
 *
 * @OA\Get(
 *     path="/api/saved-searches/{id}",
 *     tags={"SavedSearches"},
 *     summary="Get a single saved search",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Saved search details"),
 *     @OA\Response(response=404, description="Saved search not found")
 * )
 *
 * @OA\Post(
 *     path="/api/saved-searches",
 *     tags={"SavedSearches"},
 *     summary="Create a new saved search",
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "search_criteria", "name", "notification_frequency"},
 *             @OA\Property(property="user_id", type="integer"),
 *             @OA\Property(property="search_criteria", type="string"),
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="notification_frequency", type="string"),
 *             @OA\Property(property="last_notified_at", type="string", format="date-time")
 *         )
 *     ),
 *     @OA\Response(response=201, description="Saved search created"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Put(
 *     path="/api/saved-searches/{id}",
 *     tags={"SavedSearches"},
 *     summary="Update a saved search",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="search_criteria", type="string"),
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="notification_frequency", type="string"),
 *             @OA\Property(property="last_notified_at", type="string", format="date-time")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Saved search updated"),
 *     @OA\Response(response=404, description="Saved search not found"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Delete(
 *     path="/api/saved-searches/{id}",
 *     tags={"SavedSearches"},
 *     summary="Delete a saved search",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Saved search deleted"),
 *     @OA\Response(response=404, description="Saved search not found")
 * )
 */
class SavedSearchController extends Controller
{
    public function index()
    {
        $savedSearches = SavedSearch::with('user')->paginate(20);
        return JsonResource::collection($savedSearches);
    }

    public function show($id)
    {
        $savedSearch = SavedSearch::with('user')->findOrFail($id);
        return new JsonResource($savedSearch);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'search_criteria' => 'required|json',
            'name' => 'required|string',
            'notification_frequency' => 'required|string',
            'last_notified_at' => 'nullable|date',
        ]);
        $savedSearch = SavedSearch::create($data);
        return new JsonResource($savedSearch);
    }

    public function update(Request $request, $id)
    {
        $savedSearch = SavedSearch::findOrFail($id);
        $data = $request->validate([
            'search_criteria' => 'sometimes|json',
            'name' => 'sometimes|string',
            'notification_frequency' => 'sometimes|string',
            'last_notified_at' => 'nullable|date',
        ]);
        $savedSearch->update($data);
        return new JsonResource($savedSearch);
    }

    public function destroy($id)
    {
        $savedSearch = SavedSearch::findOrFail($id);
        $savedSearch->delete();
        return response()->json(['message' => 'Saved search deleted']);
    }
}
