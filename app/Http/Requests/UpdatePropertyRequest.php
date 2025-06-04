<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'property_type_id' => 'sometimes|required|exists:property_types,id',
            'listing_method_id' => 'sometimes|required|exists:listing_methods,id',
            'listing_status_id' => 'sometimes|required|exists:listing_statuses,id',
            'beds' => 'nullable|integer|min:0',
            'baths' => 'nullable|integer|min:0',
            'parking_spaces' => 'nullable|integer|min:0',
            'land_size_sqm' => 'nullable|numeric|min:0',
            'building_size_sqm' => 'nullable|numeric|min:0',
            'ensuites' => 'nullable|integer|min:0',
            'garage_spaces' => 'nullable|integer|min:0',
            'dynamic_attributes' => 'nullable|array',
            'address' => 'nullable|array',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'features' => 'nullable|array',
            'features.*' => 'exists:features,id',
        ];
    }
}
