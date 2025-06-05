<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $fillable = ['name', 'country_id', 'iso_code'];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function suburbs()
    {
        return $this->hasMany(Suburb::class);
    }
}
