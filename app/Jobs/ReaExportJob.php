<?php

namespace App\Jobs;

use App\Models\Property;
use App\Services\ReaExportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ReaExportFailedNotification;

class ReaExportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $propertyId;

    public function __construct($propertyId)
    {
        $this->propertyId = $propertyId;
    }

    public function handle(ReaExportService $exporter)
    {
        $property = Property::with(['address', 'agent', 'features'])->find($this->propertyId);
        if (!$property) {
            Log::error('REA export job: property not found', ['property_id' => $this->propertyId]);
            return;
        }
        $result = $exporter->export($property);
        if (!$result['success']) {
            Log::warning('REA export job: retry failed', ['property_id' => $this->propertyId, 'response' => $result['response'], 'attempts' => $this->attempts()]);
            // After 3 attempts, notify admin
            if ($this->attempts() >= 3) {
                Notification::route('mail', config('admin.email', 'admin@example.com'))
                    ->notify(new ReaExportFailedNotification($property, $result['response']));
                Log::critical('REA export job: persistent failure, admin notified', ['property_id' => $this->propertyId]);
            }
        }
    }
}
