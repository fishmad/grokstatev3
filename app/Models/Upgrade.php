<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Upgrade extends Model
{
    protected $fillable = [
        'property_id',
        'user_id',
        'type',
        'status',
    ];
}
