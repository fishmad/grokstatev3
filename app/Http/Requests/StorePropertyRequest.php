<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Anyone authenticated can attempt to create a property
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'property_type_id' => 'required|exists:property_types,id',
            'listing_method_id' => 'required|exists:listing_methods,id',
            'listing_status_id' => 'required|exists:listing_statuses,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'features' => 'nullable|array',
            'features.*' => 'exists:features,id',
            'street_number' => 'nullable|string|max:50',
            'street_name' => 'required|string|max:255',
            'unit_number' => 'nullable|string|max:50',
            'lot_number' => 'nullable|string|max:50',
            'site_name' => 'nullable|string|max:255',
            'region_name' => 'nullable|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'suburb_id' => 'required|exists:suburbs,id',
            'postcode' => 'required|string|max:20',
            'lat' => 'nullable|numeric',
            'long' => 'nullable|numeric',
            'display_address_on_map' => 'nullable|boolean',
            'display_street_view' => 'nullable|boolean',
            'beds' => 'nullable|integer|min:0',
            'baths' => 'nullable|integer|min:0',
            'parking_spaces' => 'nullable|integer|min:0',
            'ensuites' => 'nullable|integer|min:0',
            'garage_spaces' => 'nullable|integer|min:0',
            'land_size' => 'nullable|numeric|min:0',
            'land_size_unit' => 'nullable|string|max:10',
            'building_size' => 'nullable|numeric|min:0',
            'building_size_unit' => 'nullable|string|max:10',
            'dynamic_attributes' => 'nullable|array',
            'slug' => 'nullable|string|max:255',
            'prices' => 'nullable|array',
            'media' => 'nullable|array',
        ];
    }
}
