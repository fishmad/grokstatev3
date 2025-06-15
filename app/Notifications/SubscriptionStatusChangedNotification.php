<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $status;
    public $details;

    public function __construct($status, $details = null)
    {
        $this->status = $status;
        $this->details = $details;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Subscription Status Changed')
            ->line('Your subscription status has changed: ' . $this->status)
            ->line($this->details ? 'Details: ' . $this->details : '');
    }
}
