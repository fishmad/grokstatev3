<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Env;
use Illuminate\Support\Facades\Response;
use Illuminate\Routing\Controller;

class StripeSettingsController extends Controller
{
    // GET: /api/admin/stripe/config
    public function getConfig()
    {
        return response()->json([
            'stripe_key' => config('services.stripe.key'), // publishable key
            'stripe_secret' => config('services.stripe.secret') ? '********' : '', // never expose secret
            'webhook_secret' => config('services.stripe.webhook_secret') ? '********' : '', // never expose webhook secret
        ]);
    }

    // POST: /api/admin/stripe/config
    public function saveConfig(Request $request)
    {
        // Disable saving keys from the UI for security reasons
        return response()->json(['success' => false, 'message' => 'Saving Stripe keys from the UI is disabled. Please update your .env file directly.'], 403);
    }

    // GET: /api/admin/stripe/test
    public function testConnection()
    {
        $key = config('services.stripe.secret');
        try {
            $client = new \Stripe\StripeClient($key);
            // Fetch the current account (this does not require an ID)
            $account = $client->accounts->retrieve();
            return response()->json(['success' => true, 'account' => $account]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // GET: /api/admin/stripe/account-details
    public function accountDetails()
    {
        $key = config('services.stripe.secret');
        try {
            $client = new \Stripe\StripeClient($key);
            $account = $client->accounts->retrieve();
            return response()->json([
                'success' => true,
                'account' => [
                    'id' => $account->id ?? null,
                    'email' => $account->email ?? null,
                    'business_type' => $account->business_type ?? null,
                    'country' => $account->country ?? null,
                    'capabilities' => $account->capabilities ?? null,
                    'charges_enabled' => $account->charges_enabled ?? null,
                    'payouts_enabled' => $account->payouts_enabled ?? null,
                    'details_submitted' => $account->details_submitted ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // GET: /api/admin/stripe/webhooks
    public function webhooks()
    {
        $key = config('services.stripe.secret');
        try {
            $client = new \Stripe\StripeClient($key);
            $webhooks = $client->webhookEndpoints->all(['limit' => 10]);
            return response()->json(['success' => true, 'webhooks' => $webhooks->data]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // GET: /api/admin/stripe/events
    public function events()
    {
        $key = config('services.stripe.secret');
        try {
            $client = new \Stripe\StripeClient($key);
            $events = $client->events->all(['limit' => 10]);
            return response()->json(['success' => true, 'events' => $events->data]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // GET: /api/admin/stripe/products
    public function products()
    {
        $key = config('services.stripe.secret');
        try {
            $client = new \Stripe\StripeClient($key);
            $products = $client->products->all(['limit' => 20]);
            $prices = $client->prices->all(['limit' => 100]);
            // Attach prices to products
            $productsArr = [];
            foreach ($products->data as $product) {
                $productPrices = array_values(array_filter($prices->data, function ($price) use ($product) {
                    return $price->product === $product->id;
                }));
                $productsArr[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'prices' => array_map(function ($price) {
                        return [
                            'id' => $price->id,
                            'nickname' => $price->nickname,
                            'unit_amount' => $price->unit_amount,
                            'currency' => $price->currency,
                            'recurring' => $price->recurring,
                        ];
                    }, $productPrices),
                ];
            }
            return response()->json(['success' => true, 'products' => $productsArr]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
