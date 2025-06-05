<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'property_id',
        'suburb_id',
        'street_number',
        'street_name',
        'unit_number',
        'lot_number',
        'site_name',
        'region_name',
        'lat',
        'long',
        'display_address_on_map',
        'display_street_view',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
