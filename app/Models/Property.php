<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function listingMethod()
    {
        return $this->belongsTo(ListingMethod::class);
    }

    public function listingStatus()
    {
        return $this->belongsTo(ListingStatus::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'property_category');
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class, 'property_feature');
    }

    public function prices()
    {
        return $this->hasMany(Price::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }

    public function agents()
    {
        return $this->belongsToMany(User::class, 'property_agent')
            ->withPivot('agent_order', 'receive_campaign_report');
    }

    public function upgrades()
    {
        return $this->hasMany(Upgrade::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    protected $casts = [
        'dynamic_attributes' => 'array',
        'is_free' => 'boolean',
        'expires_at' => 'datetime',
    ];
}
