<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;

class StripeWebhookController extends CashierWebhookController
{
    /**
     * @OA\Post(
     *     path="/stripe/webhook",
     *     tags={"Payments"},
     *     summary="Stripe webhook endpoint for payment and subscription events",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(mediaType="application/json")
     *     ),
     *     @OA\Response(response=200, description="Webhook handled")
     * )
     */
    public function handleWebhook(Request $request)
    {
        // Log all incoming events for traceability
        Log::info('Stripe webhook received', [
            'event' => $request->input('type'),
            'payload' => $request->all(),
        ]);
        // Let Cashier handle most events, but you can add custom logic below
        return parent::handleWebhook($request);
    }

    // Handle successful payment
    public function handleInvoicePaymentSucceeded($payload)
    {
        Log::info('Stripe invoice payment succeeded', $payload);
        $invoice = $payload['data']['object'] ?? null;
        if ($invoice && isset($invoice['customer'])) {
            $user = \App\Models\User::where('stripe_id', $invoice['customer'])->first();
            if ($user) {
                $amount = number_format($invoice['amount_paid'] / 100, 2);
                $desc = $invoice['description'] ?? 'Subscription payment';
                $user->notify(new \App\Notifications\SubscriptionStatusChangedNotification(
                    'active',
                    "Your payment of \\${$amount} for '{$desc}' was successful. Thank you!"
                ));
            }
        }
        return response('Webhook Handled', 200);
    }

    // Handle failed payment
    public function handleInvoicePaymentFailed($payload)
    {
        Log::warning('Stripe invoice payment failed', $payload);
        $invoice = $payload['data']['object'] ?? null;
        if ($invoice && isset($invoice['customer'])) {
            $user = \App\Models\User::where('stripe_id', $invoice['customer'])->first();
            if ($user) {
                $amount = number_format($invoice['amount_due'] / 100, 2);
                $desc = $invoice['description'] ?? 'Subscription payment';
                $user->notify(new \App\Notifications\PaymentFailedNotification(
                    "Your payment of \\${$amount} for '{$desc}' failed. Please update your payment method."
                ));
            }
        }
        // Log for admin review
        Log::channel('slack')->error('Stripe payment failed', $payload);
        return response('Webhook Handled', 200);
    }

    // Handle subscription created/updated/deleted
    public function handleCustomerSubscriptionCreated($payload)
    {
        Log::info('Stripe subscription created', $payload);
        $subscription = $payload['data']['object'] ?? null;
        if ($subscription && isset($subscription['customer'])) {
            $user = \App\Models\User::where('stripe_id', $subscription['customer'])->first();
            if ($user) {
                $plan = $subscription['plan']['nickname'] ?? $subscription['plan']['id'] ?? 'your plan';
                $user->notify(new \App\Notifications\SubscriptionStatusChangedNotification(
                    'created',
                    "Your subscription to '{$plan}' has been created."
                ));
            }
        }
        return response('Webhook Handled', 200);
    }
    public function handleCustomerSubscriptionUpdated($payload)
    {
        Log::info('Stripe subscription updated', $payload);
        $subscription = $payload['data']['object'] ?? null;
        if ($subscription && isset($subscription['customer'])) {
            $user = \App\Models\User::where('stripe_id', $subscription['customer'])->first();
            if ($user) {
                $status = $subscription['status'] ?? 'updated';
                $user->notify(new \App\Notifications\SubscriptionStatusChangedNotification(
                    $status,
                    "Your subscription status is now '{$status}'."
                ));
            }
        }
        return response('Webhook Handled', 200);
    }
    public function handleCustomerSubscriptionDeleted($payload)
    {
        Log::info('Stripe subscription deleted', $payload);
        $subscription = $payload['data']['object'] ?? null;
        if ($subscription && isset($subscription['customer'])) {
            $user = \App\Models\User::where('stripe_id', $subscription['customer'])->first();
            if ($user) {
                $user->notify(new \App\Notifications\SubscriptionStatusChangedNotification(
                    'cancelled',
                    'Your subscription has been cancelled. If this was a mistake, please contact support.'
                ));
            }
        }
        // Log for admin review
        Log::channel('slack')->warning('Stripe subscription cancelled', $payload);
        return response('Webhook Handled', 200);
    }

    // Handle one-time payment success/failure
    public function handlePaymentIntentSucceeded($payload)
    {
        Log::info('Stripe payment intent succeeded', $payload);
        $intent = $payload['data']['object'] ?? null;
        if ($intent && isset($intent['customer'])) {
            $user = \App\Models\User::where('stripe_id', $intent['customer'])->first();
            if ($user) {
                // Mark related payment as paid
                \App\Models\Payment::where('gateway_transaction_id', $intent['id'])
                    ->update(['status' => 'paid']);
                // Optionally, mark property as upgraded if metadata present
                if (isset($intent['metadata']['property_id'])) {
                    \App\Models\Property::where('id', $intent['metadata']['property_id'])
                        ->update(['is_featured' => true]);
                }
                $amount = number_format($intent['amount_received'] / 100, 2);
                $desc = $intent['description'] ?? 'Listing upgrade';
                $user->notify(new \App\Notifications\SubscriptionStatusChangedNotification(
                    'one-time-success',
                    "Your one-time payment of \\${$amount} for '{$desc}' was successful."
                ));
            }
        }
        return response('Webhook Handled', 200);
    }
    public function handlePaymentIntentPaymentFailed($payload)
    {
        Log::warning('Stripe payment intent failed', $payload);
        $intent = $payload['data']['object'] ?? null;
        if ($intent && isset($intent['customer'])) {
            $user = \App\Models\User::where('stripe_id', $intent['customer'])->first();
            if ($user) {
                $amount = isset($intent['amount']) ? number_format($intent['amount'] / 100, 2) : 'unknown';
                $desc = $intent['description'] ?? 'Listing upgrade';
                $user->notify(new \App\Notifications\PaymentFailedNotification(
                    "Your one-time payment of \\${$amount} for '{$desc}' failed. Please try again or contact support."
                ));
            }
        }
        // Log for admin review
        Log::channel('slack')->error('Stripe one-time payment failed', $payload);
        return response('Webhook Handled', 200);
    }
}
