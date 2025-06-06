<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'property_id',
        'suburb_id',
        'country_id',
        'state_id',
        'street_number',
        'street_name',
        'unit_number',
        'lot_number',
        'site_name',
        'region_name',
        'lat',
        'long',
        'latitude',
        'longitude',
        'postcode',
        'display_address_on_map',
        'display_street_view',
    ];

    protected $with = ['suburb', 'state', 'country'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
    public function suburb()
    {
        return $this->belongsTo(Suburb::class);
    }
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    // Computed attributes for serialization (not relationships)
    public function getStateAttribute()
    {
        return $this->suburb ? $this->suburb->state : null;
    }
    public function getCountryAttribute()
    {
        return $this->suburb && $this->suburb->state ? $this->suburb->state->country : null;
    }
}
