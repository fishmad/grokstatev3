<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeatureController extends Controller
{
    public function index()
    {
        $features = Feature::paginate(20);
        return JsonResource::collection($features);
    }

    public function show($id)
    {
        $feature = Feature::findOrFail($id);
        return new JsonResource($feature);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'car_spaces' => 'nullable|integer',
            'land_size' => 'nullable|numeric',
            'new_or_established' => 'nullable|boolean',
            'outdoor_features' => 'nullable|json',
            'indoor_features' => 'nullable|json',
            'climate_energy_features' => 'nullable|json',
            'accessibility_features' => 'nullable|json',
            'keywords' => 'nullable|json',
        ]);
        $feature = Feature::create($data);
        return new JsonResource($feature);
    }

    public function update(Request $request, $id)
    {
        $feature = Feature::findOrFail($id);
        $data = $request->validate([
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'car_spaces' => 'nullable|integer',
            'land_size' => 'nullable|numeric',
            'new_or_established' => 'nullable|boolean',
            'outdoor_features' => 'nullable|json',
            'indoor_features' => 'nullable|json',
            'climate_energy_features' => 'nullable|json',
            'accessibility_features' => 'nullable|json',
            'keywords' => 'nullable|json',
        ]);
        $feature->update($data);
        return new JsonResource($feature);
    }

    public function destroy($id)
    {
        $feature = Feature::findOrFail($id);
        $feature->delete();
        return response()->json(['message' => 'Feature deleted']);
    }
}
