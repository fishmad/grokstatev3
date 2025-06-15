<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscriptionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    /**
     * Get the authenticated user's subscriptions.
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json($user->subscriptions);
    }

    /**
     * Create a new subscription for the authenticated user.
     */
    public function store(SubscriptionRequest $request)
    {
        $user = Auth::user();
        $subscription = $user->newSubscription('default', $request->plan)
            ->create($request->payment_method);
        return response()->json($subscription, 201);
    }

    /**
     * Cancel a subscription.
     */
    public function destroy($subscriptionId)
    {
        $user = Auth::user();
        $subscription = $user->subscriptions()->findOrFail($subscriptionId);
        $subscription->cancel();
        return response()->json(['message' => 'Subscription cancelled']);
    }
}

/**
 * @OA\PathItem(
 *     path="/api/subscription",
 *     @OA\Get(
 *         summary="List all subscriptions",
 *         tags={"Subscription"},
 *         security={{"bearerAuth":{}}},
 *         @OA\Response(response=200, description="List of subscriptions")
 *     ),
 *     @OA\Post(
 *         summary="Create a new subscription",
 *         tags={"Subscription"},
 *         security={{"bearerAuth":{}}},
 *         @OA\RequestBody(required=true, @OA\JsonContent()),
 *         @OA\Response(response=201, description="Subscription created")
 *     )
 * )
 * @OA\PathItem(
 *     path="/api/subscription/{id}",
 *     @OA\Get(
 *         summary="Get subscription details",
 *         tags={"Subscription"},
 *         security={{"bearerAuth":{}}},
 *         @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *         @OA\Response(response=200, description="Subscription details")
 *     ),
 *     @OA\Put(
 *         summary="Update a subscription",
 *         tags={"Subscription"},
 *         security={{"bearerAuth":{}}},
 *         @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *         @OA\RequestBody(required=true, @OA\JsonContent()),
 *         @OA\Response(response=200, description="Subscription updated")
 *     ),
 *     @OA\Delete(
 *         summary="Delete a subscription",
 *         tags={"Subscription"},
 *         security={{"bearerAuth":{}}},
 *         @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *         @OA\Response(response=200, description="Subscription deleted")
 *     )
 * )
 */
