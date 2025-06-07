<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'property_type_id' => 'required|exists:property_types,id',
            'listing_method_id' => 'required|exists:listing_methods,id',
            'listing_status_id' => 'nullable|exists:listing_statuses,id',
            'categories' => ['required', 'array'],
            'categories.*' => ['exists:categories,id'],
            'features' => ['required', 'array'],
            'features.*' => ['exists:features,id'],
            // Address fields from the nested 'address' object
            'address.street_number' => 'nullable|string|max:50',
            'address.street_name' => 'required|string|max:255',
            'address.unit_number' => 'nullable|string|max:50',
            'address.lot_number' => 'nullable|string|max:50',
            'address.site_name' => 'nullable|string|max:255',
            'address.region_name' => 'nullable|string|max:255',
            'address.lat' => 'nullable|numeric',
            'address.long' => 'nullable|numeric',
            'address.display_address_on_map' => 'nullable|boolean',
            'address.display_street_view' => 'nullable|boolean',
            'address.country' => 'required|string|max:255', // Validate string country from address object
            'address.state' => 'required|string|max:255',   // Validate string state from address object
            'address.suburb' => 'required|string|max:255',  // Validate string suburb from address object
            'address.postcode' => 'required|string|max:20', // Ensure postcode is preserved in nested address
            // 'address.postcode' will be validated by the top-level 'postcode' rule after prepareForValidation
            // Top-level location fields (IDs are nullable, postcode is required string)
            // These are merged into the 'address' array by prepareForValidation
            'country_id' => 'nullable|integer', // Allow null, controller will handle
            'state_id' => 'nullable|integer',   // Allow null, controller will handle
            'suburb_id' => 'nullable|integer',  // Allow null, controller will handle
            'postcode' => 'required|string|max:20', // This is the top-level postcode from your log
            // Property details
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
            // Price
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
        \Log::info('DEBUG: StorePropertyRequest raw input', $this->all());
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
        // Only merge state_id and country_id (suburb_id is always set by controller after location resolution)
        foreach (['state_id', 'country_id'] as $field) {
            if ($this->has($field)) {
                $address[$field] = $this->input($field);
            }
        }
        // Always set postcode from top-level if present, or keep existing if present in address
        if ($this->has('postcode')) {
            $address['postcode'] = $this->input('postcode');
        } elseif (isset($address['postcode'])) {
            // already present, do nothing
        } else {
            $address['postcode'] = null;
        }
        $this->merge(['address' => $address]);
    }
}