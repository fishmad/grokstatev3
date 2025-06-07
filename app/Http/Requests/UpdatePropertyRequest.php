<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'property_type_id' => 'nullable|exists:property_types,id',
            'listing_method_id' => 'nullable|exists:listing_methods,id',
            'listing_status_id' => 'nullable|exists:listing_statuses,id',
            'categories' => ['required', 'array'],
            'categories.*' => ['exists:categories,id'],
            'features' => ['nullable', 'array'],
            'features.*' => ['exists:features,id'],
            'street_number' => 'nullable|string|max:50',
            'street_name' => 'nullable|string|max:255',
            'unit_number' => 'nullable|string|max:50',
            'lot_number' => 'nullable|string|max:50',
            'site_name' => 'nullable|string|max:255',
            'region_name' => 'nullable|string|max:255',
            'country_id' => 'nullable|exists:countries,id',
            'state_id' => 'nullable|exists:states,id',
            'suburb_id' => 'nullable|exists:suburbs,id',
            'postcode' => 'nullable|string|max:20',
            'lat' => 'nullable|numeric',
            'long' => 'nullable|numeric',
            'display_address_on_map' => 'nullable|boolean',
            'display_street_view' => 'nullable|boolean',
            'beds' => 'nullable|numeric',
            'baths' => 'nullable|numeric',
            'parking_spaces' => 'nullable|numeric',
            'ensuites' => 'nullable|numeric',
            'garage_spaces' => 'nullable|numeric',
            'land_size' => 'nullable|numeric',
            'land_size_unit' => 'nullable|string|in:sqm,acre,ha',
            'building_size' => 'nullable|numeric',
            'building_size_unit' => 'nullable|string|in:sqm,sqft,ha',
            'dynamic_attributes' => 'nullable|array',
            'slug' => 'nullable|string|max:255',
            'media' => ['nullable', 'array'],
            'media.*' => ['file', 'mimes:jpg,jpeg,png', 'max:5000'],
            // Single price object validation
            'price' => ['nullable', 'array'],
            'price.price_type' => ['required_with:price', 'in:sale,rent_weekly,rent_monthly,rent_yearly,offers_above,offers_between,enquire,contact,call,negotiable,fixed,tba'],
            'price.amount' => ['nullable', 'numeric', 'min:1000'],
            'price.range_min' => ['nullable', 'numeric', 'min:1000', 'required_if:price.price_type,offers_between'],
            'price.range_max' => ['nullable', 'numeric', 'min:1000', 'required_if:price.price_type,offers_between', 'gt:price.range_min'],
            'price.label' => ['nullable', 'string', 'max:255'],
            'price.hide_amount' => ['boolean'],
            'price.penalize_search' => ['boolean'],
            'price.display' => ['boolean'],
            'price.tax' => ['required_with:price', 'in:unknown,exempt,inclusive,exclusive'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('dynamic_attributes') && is_string($this->input('dynamic_attributes'))) {
            $this->merge([
                'dynamic_attributes' => json_decode($this->input('dynamic_attributes'), true) ?? [],
            ]);
        }
        if ($this->has('price') && is_string($this->input('price'))) {
            $this->merge([
                'price' => json_decode($this->input('price'), true) ?? [],
            ]);
        }
        // Move location fields into address if present
        $address = $this->input('address', []);
        foreach (['suburb_id', 'state_id', 'country_id', 'postcode'] as $field) {
            if ($this->has($field)) {
                $address[$field] = $this->input($field);
            }
        }
        $this->merge(['address' => $address]);
    }
}