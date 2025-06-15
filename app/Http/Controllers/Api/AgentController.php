<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Tag(
 *     name="Agents",
 *     description="Operations about property agents"
 * )
 *
 * @OA\Get(
 *     path="/api/agents",
 *     tags={"Agents"},
 *     summary="List all agents",
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="List of agents")
 * )
 *
 * @OA\Get(
 *     path="/api/agents/{id}",
 *     tags={"Agents"},
 *     summary="Get a single agent",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Agent details"),
 *     @OA\Response(response=404, description="Agent not found")
 * )
 *
 * @OA\Post(
 *     path="/api/agents",
 *     tags={"Agents"},
 *     summary="Create a new agent",
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "name", "email"},
 *             @OA\Property(property="user_id", type="integer"),
 *             @OA\Property(property="unique_listing_agent_id", type="string"),
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="email", type="string"),
 *             @OA\Property(property="phone", type="string"),
 *             @OA\Property(property="agency_name", type="string"),
 *             @OA\Property(property="license_number", type="string")
 *         )
 *     ),
 *     @OA\Response(response=201, description="Agent created"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Put(
 *     path="/api/agents/{id}",
 *     tags={"Agents"},
 *     summary="Update an agent",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="email", type="string"),
 *             @OA\Property(property="phone", type="string"),
 *             @OA\Property(property="agency_name", type="string"),
 *             @OA\Property(property="license_number", type="string")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Agent updated"),
 *     @OA\Response(response=404, description="Agent not found"),
 *     @OA\Response(response=422, description="Validation failed")
 * )
 *
 * @OA\Delete(
 *     path="/api/agents/{id}",
 *     tags={"Agents"},
 *     summary="Delete an agent",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Agent deleted"),
 *     @OA\Response(response=404, description="Agent not found")
 * )
 */

class AgentController extends Controller
{
    // List all agents
    public function index()
    {
        $agents = Agent::with('user')->paginate(20);
        return JsonResource::collection($agents);
    }

    // Show a single agent
    public function show($id)
    {
        $agent = Agent::with('user')->findOrFail($id);
        return new JsonResource($agent);
    }

    // Create a new agent (admin only)
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'unique_listing_agent_id' => 'nullable|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'agency_name' => 'nullable|string',
            'license_number' => 'nullable|string',
        ]);
        $agent = Agent::create($data);
        return new JsonResource($agent);
    }

    // Update an agent
    public function update(Request $request, $id)
    {
        $agent = Agent::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email',
            'phone' => 'nullable|string',
            'agency_name' => 'nullable|string',
            'license_number' => 'nullable|string',
        ]);
        $agent->update($data);
        return new JsonResource($agent);
    }

    // Delete an agent
    public function destroy($id)
    {
        $agent = Agent::findOrFail($id);
        $agent->delete();
        return response()->json(['message' => 'Agent deleted']);
    }
}
