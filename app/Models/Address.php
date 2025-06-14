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
        'region_id',
        'address_line_1',
        'address_line_2',
        'suburb_name',
        'state_name',
        'postcode',
        'country_name',
        'city_name',
        'region_name',
        'lot_number',
        'unit_number',
        'street_number',
        'street_name',
        'street_type',
        'is_unit',
        'is_lot',
        'is_complex',
        'complex_number',
        'complex_street_name',
        'complex_name',
        'formatted_address',
        'latitude',
        'longitude',
        'display_address_on_map',
        'display_street_view',
        'display_full_address',
        'display_suburb_only',
    ];

    protected $with = ['suburb', 'state', 'country', 'region'];

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
    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}
