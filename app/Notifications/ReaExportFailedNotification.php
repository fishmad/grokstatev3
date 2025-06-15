<?php

namespace App\Notifications;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ReaExportFailedNotification extends Notification
{
    use Queueable;

    public $property;
    public $error;

    public function __construct(Property $property, $error)
    {
        $this->property = $property;
        $this->error = $error;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('REA Export Persistent Failure')
            ->line('A property export to REA Group has failed 3 times.')
            ->line('Property ID: ' . $this->property->id)
            ->line('Headline: ' . $this->property->headline)
            ->line('Error: ' . (is_string($this->error) ? $this->error : json_encode($this->error)))
            ->action('View Property', url('/admin/properties/' . $this->property->id));
    }
}
