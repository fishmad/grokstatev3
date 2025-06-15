<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentController extends Controller
{
    // List all payments (admin only)
    public function index()
    {
        $payments = Payment::with(['user', 'property', 'invoice'])->paginate(20);
        return JsonResource::collection($payments);
    }

    // Show a single payment
    public function show($id)
    {
        $payment = Payment::with(['user', 'property', 'invoice'])->findOrFail($id);
        return new JsonResource($payment);
    }

    // Store a new payment
    public function store(PaymentRequest $request)
    {
        $payment = Payment::create($request->validated());
        return new JsonResource($payment);
    }

    /**
     * @OA\Post(
     *     path="/payments/subscribe",
     *     tags={"Payments"},
     *     summary="Subscribe the authenticated user to a plan",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"plan"},
     *             @OA\Property(property="plan", type="string", example="premium"),
     *             @OA\Property(property="payment_method", type="string", example="pm_card_visa")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Subscription created"),
     *     @OA\Response(response=400, description="Error")
     * )
     */
    public function subscribe(Request $request)
    {
        $request->validate(['plan' => 'required|string']);
        $user = $request->user();
        $paymentMethod = $request->input('payment_method');
        if ($paymentMethod) {
            $user->updateDefaultPaymentMethod($paymentMethod);
        }
        $subscription = $user->newSubscription('default', $request->plan)
            ->create($paymentMethod);
        return response()->json(['status' => 'subscribed', 'subscription' => $subscription]);
    }

    /**
     * @OA\Post(
     *     path="/payments/one-time",
     *     tags={"Payments"},
     *     summary="Create a one-time payment for a listing upgrade",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"amount"},
     *             @OA\Property(property="amount", type="number", example=99.00)
     *         )
     *     ),
     *     @OA\Response(response=200, description="PaymentIntent client secret returned"),
     *     @OA\Response(response=400, description="Error")
     * )
     */
    public function oneTime(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);
        $user = $request->user();
        $intent = $user->createSetupIntent();
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $request->amount * 100,
            'currency' => 'aud',
            'customer' => $user->stripe_id,
            'metadata' => ['purpose' => 'listing_upgrade'],
        ]);
        return response()->json(['client_secret' => $paymentIntent->client_secret]);
    }

    /**
     * @OA\Get(
     *     path="/payments/status",
     *     tags={"Payments"},
     *     summary="Get the authenticated user's subscription/payment status",
     *     @OA\Response(response=200, description="Status returned")
     * )
     */
    public function status(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'subscribed' => $user->subscribed('default'),
            'subscription' => $user->subscription('default'),
        ]);
    }
}
