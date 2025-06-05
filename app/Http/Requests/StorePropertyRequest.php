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
            'street_number' => 'nullable|string|max:50',
            'street_name' => 'required|string|max:255',
            'unit_number' => 'nullable|string|max:50',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'suburb_id' => 'required|exists:suburbs,id',
            'postcode' => 'required|string|max:20',
            'lat' => 'nullable|numeric',
            'long' => 'nullable|numeric',
        ];
    }
}
