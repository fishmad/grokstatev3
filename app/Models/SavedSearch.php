<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedSearch extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'search_criteria',
        'notification_frequency',
        'receive_alerts',
        'last_notified_at',
    ];

    protected $casts = [
        'search_criteria' => 'array',
        'receive_alerts' => 'boolean',
        'last_notified_at' => 'datetime',
    ];

    /**
     * Get the user that owns the saved search.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
