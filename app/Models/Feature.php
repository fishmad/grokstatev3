<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    public function groups()
    {
        return $this->belongsToMany(FeatureGroup::class, 'feature_group_feature');
    }
}
