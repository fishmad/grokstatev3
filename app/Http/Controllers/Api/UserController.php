<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Tag(
 *     name="Users",
 *     description="Operations about users"
 * )
 *
 * @OA\Get(
 *     path="/api/users",
 *     tags={"Users"},
 *     summary="List all users (admin only)",
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="List of users")
 * )
 *
 * @OA\Get(
 *     path="/api/users/{id}",
 *     tags={"Users"},
 *     summary="Get a single user",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="User details"),
 *     @OA\Response(response=404, description="User not found")
 * )
 *
 * @OA\Put(
 *     path="/api/users/{id}",
 *     tags={"Users"},
 *     summary="Update a user (admin only)",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="email", type="string"),
 *             @OA\Property(property="is_active", type="boolean")
 *         )
 *     ),
 *     @OA\Response(response=200, description="User updated"),
 *     @OA\Response(response=404, description="User not found"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Delete(
 *     path="/api/users/{id}",
 *     tags={"Users"},
 *     summary="Delete a user (admin only)",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="User deleted"),
 *     @OA\Response(response=404, description="User not found")
 * )
 */
class UserController extends Controller
{
    // List all users (admin only)
    public function index()
    {
        $users = User::paginate(20);
        return JsonResource::collection($users);
    }

    // Show a single user
    public function show($id)
    {
        $user = User::findOrFail($id);
        return new JsonResource($user);
    }

    // Update a user (admin only)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email',
            'is_active' => 'sometimes|boolean',
        ]);
        $user->update($data);
        return new JsonResource($user);
    }

    // Delete a user (admin only)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
