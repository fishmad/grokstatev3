<?php

namespace App\Services;

use App\Models\Property;
use App\Services\ReaxmlService;
use App\Services\ReaApiService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Bus;
use App\Jobs\ReaExportJob;

class ReaExportService
{
    protected $reaxml;
    protected $reaApi;
    protected $endpoint;

    public function __construct(ReaxmlService $reaxml, ReaApiService $reaApi)
    {
        $this->reaxml = $reaxml;
        $this->reaApi = $reaApi;
        $this->endpoint = config('services.rea.export_url', 'https://api.domain.com.au/v1/listings'); // Example endpoint
    }

    /**
     * Export a property to REA Group (realestate.com.au) using REAXML XML.
     *
     * @param Property $property
     * @return array [success => bool, response => mixed]
     */
    public function export(Property $property): array
    {
        $xml = $this->reaxml->generate($property);
        $token = $this->reaApi->getAccessToken();
        $response = Http::withToken($token)
            ->withHeaders(['Content-Type' => 'application/xml'])
            ->post($this->endpoint, $xml);
        Log::info('REA export attempt', [
            'property_id' => $property->id,
            'status' => $response->status(),
            'success' => $response->successful(),
            'body' => $response->body(),
        ]);
        if (!$response->successful()) {
            Log::error('REA export failed', [
                'property_id' => $property->id,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            // Optionally schedule a retry
            $this->scheduleRetry($property);
        }
        return [
            'success' => $response->successful(),
            'response' => $response->json() ?? $response->body(),
            'status' => $response->status(),
        ];
    }

    /**
     * Schedule a retry for failed export using a queued job.
     */
    public function scheduleRetry(Property $property)
    {
        // Dispatch a job with delay (e.g., 5 minutes)
        Bus::dispatch((new ReaExportJob($property->id))->delay(now()->addMinutes(5)));
    }
}
