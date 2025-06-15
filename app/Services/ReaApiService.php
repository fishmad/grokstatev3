<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ReaApiService
{
    protected $clientId;
    protected $clientSecret;
    protected $tokenUrl;

    public function __construct()
    {
        $this->clientId = config('services.rea.client_id');
        $this->clientSecret = config('services.rea.client_secret');
        $this->tokenUrl = config('services.rea.token_url');
    }

    /**
     * Get a valid OAuth access token (cached).
     */
    public function getAccessToken()
    {
        return Cache::remember('rea_access_token', 3500, function () {
            $response = Http::asForm()->post($this->tokenUrl, [
                'grant_type' => 'client_credentials',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'scope' => '', // add scope if required by REA
            ]);
            if (!$response->ok()) {
                throw new \Exception('Failed to get REA access token: ' . $response->body());
            }
            return $response->json('access_token');
        });
    }
}
