<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExportConstantsSchema implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        \Log::info('ExportConstantsSchema job started');
        try {
            \Artisan::call('constants:export-schema');
            \Log::info('ExportConstantsSchema job completed successfully');
            // Optionally, send a notification to admins (example: Notification::route(...)->notify(...))
        } catch (\Throwable $e) {
            \Log::error('ExportConstantsSchema job failed: ' . $e->getMessage(), ['exception' => $e]);
            // Optionally, send a failure notification
        }
    }
}
