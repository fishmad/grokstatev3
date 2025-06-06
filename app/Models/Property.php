<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    public function price()
    {
        return $this->hasOne(Price::class);
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'property_type_id',
        'listing_method_id',
        'listing_status_id',
        'beds',
        'baths',
        'parking_spaces',
        'ensuites',
        'garage_spaces',
        'land_size',
        'land_size_unit',
        'building_size',
        'building_size_unit',
        'dynamic_attributes',
        'slug',
        'user_id',
        'expires_at',
    ];

    protected $casts = [
        'dynamic_attributes' => 'array',
        'is_free' => 'boolean',
        'expires_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($property) {
            if (empty($property->slug) && !empty($property->title)) {
                $baseSlug = Str::slug($property->title);
                $slug = $baseSlug;
                $i = 2;
                while (Property::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $i;
                    $i++;
                }
                $property->slug = $slug;
            }
        });
    }
}
