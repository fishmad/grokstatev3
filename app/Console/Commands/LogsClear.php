<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class LogsClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logs:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear the Laravel log file (storage/logs/laravel.log)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $logPath = storage_path('logs/laravel.log');
        if (file_exists($logPath)) {
            $handle = fopen($logPath, 'w');
            if ($handle) {
                fclose($handle);
                clearstatcache(true, $logPath);
                $this->info('Log file cleared.');
            } else {
                $this->error('Could not open log file for writing.');
            }
        } else {
            $this->info('Log file does not exist.');
        }
        return 0;
    }
}
