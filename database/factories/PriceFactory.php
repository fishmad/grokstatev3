<?php

namespace Database\Factories;

use App\Models\Price;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class PriceFactory extends Factory
{
    protected $model = Price::class;

    public function definition(): array
    {
        $priceTypes = [
            'sale', 'rent_weekly', 'rent_monthly', 'rent_yearly', 'offers_above',
            'offers_between', 'enquire', 'contact', 'call', 'negotiable', 'fixed', 'tba'
        ];
        $priceType = $this->faker->randomElement($priceTypes);
        $amount = null;
        $rangeMin = null;
        $rangeMax = null;
        $label = null;
        $hideAmount = $this->faker->boolean(10); // 10% chance to hide amount
        $display = $this->faker->boolean(90); // 90% chance to display
        $tax = $this->faker->randomElement(['unknown', 'exempt', 'inclusive', 'exclusive']);

        // Generate data based on price_type
        switch ($priceType) {
            case 'sale':
            case 'offers_above':
            case 'fixed':
            case 'negotiable':
                $amount = $this->faker->numberBetween(100000, 2000000); // $100K-$2M
                $label = $hideAmount ? "Offers around \${$amount}" : null;
                break;
            case 'rent_weekly':
                $amount = $this->faker->numberBetween(300, 2000); // $300-$2000/week
                $label = $hideAmount ? "Rent from \${$amount}/week" : null;
                break;
            case 'rent_monthly':
                $amount = $this->faker->numberBetween(1200, 8000); // $1200-$8000/month
                $label = $hideAmount ? "Rent from \${$amount}/month" : null;
                break;
            case 'rent_yearly':
                $amount = $this->faker->numberBetween(15000, 100000); // $15K-$100K/year
                $label = $hideAmount ? "Rent from \${$amount}/year" : null;
                break;
            case 'offers_between':
                $rangeMin = $this->faker->numberBetween(100000, 1900000); // $100K-$1.9M
                $rangeMax = $rangeMin + $this->faker->numberBetween(50000, 200000); // $50K-$200K higher
                $label = $hideAmount ? "Offers between \${$rangeMin} and \${$rangeMax}" : null;
                break;
            case 'enquire':
            case 'contact':
            case 'call':
            case 'tba':
                $label = match ($priceType) {
                    'enquire' => 'Enquire for price',
                    'contact' => 'Contact agent for price',
                    'call' => 'Call for price details',
                    'tba' => 'Price to be announced',
                };
                $hideAmount = true;
                break;
        }

        // Set penalize_search based on amount, hide_amount, or non-numeric price_type
        $penalizeSearch = !$amount || $hideAmount || in_array($priceType, ['enquire', 'contact', 'call', 'tba']);

        return [
            'price_type' => $priceType,
            'amount' => $amount,
            'range_min' => $rangeMin,
            'range_max' => $rangeMax,
            'label' => $label,
            'hide_amount' => $hideAmount,
            'penalize_search' => $penalizeSearch,
            'display' => $display,
            'tax' => $tax,
            'property_id' => Property::factory(),
        ];
    }
}