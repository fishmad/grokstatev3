<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'property_id', 'price_type', 'amount', 'range_min', 'range_max',
        'label', 'hide_amount', 'penalize_search', 'display', 'tax',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'range_min' => 'decimal:2',
        'range_max' => 'decimal:2',
        'hide_amount' => 'boolean',
        'penalize_search' => 'boolean',
        'display' => 'boolean',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function getDisplayPriceAttribute(): string
    {
        if ($this->hide_amount) {
            return $this->label ?? 'Price on request';
        }

        if ($this->price_type === 'offers_between' && $this->range_min && $this->range_max) {
            return "$" . number_format($this->range_min, 2) . " - $" . number_format($this->range_max, 2);
        }

        if ($this->amount) {
            $prefix = ($this->price_type === 'offers_above') ? 'Offers above ' : '';
            $suffix = match ($this->price_type) {
                'rent_weekly' => ' p/w',
                'rent_monthly' => ' p/m',
                'rent_yearly' => ' p/a',
                default => '',
            };
            return $prefix . "$" . number_format($this->amount, 2) . $suffix;
        }

        return $this->label ?? 'Price on request';
    }
}