<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeatureGroup extends Model
{
    public function features()
    {
        return $this->belongsToMany(Feature::class, 'feature_group_feature');
    }
}
