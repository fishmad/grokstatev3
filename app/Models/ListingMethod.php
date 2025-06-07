<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingMethod extends Model
{
    protected $fillable = ['id', 'name', 'slug', 'display_names', 'description'];
    protected $casts = [
        'display_names' => 'array',
    ];
}
