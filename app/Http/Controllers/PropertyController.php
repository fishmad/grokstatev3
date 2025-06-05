<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Address;
use App\Models\PropertyType;
use App\Models\ListingMethod;
use App\Models\ListingStatus;
use App\Models\Category;
use App\Models\Feature;
use App\Models\Price;
use App\Models\User;
use App\Models\Upgrade;
use App\Models\Transaction;
use App\Models\Subscription;
use App\Models\Media;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $properties = Property::with(['address', 'propertyType', 'listingMethod', 'listingStatus', 'categories', 'features', 'prices', 'media'])
            ->where('user_id', Auth::id())
            ->orderByDesc('updated_at')
            ->orderByDesc('created_at')
            ->paginate(10);
        // Transform paginator to match frontend expectations
        return Inertia::render('properties/properties-index', [
            'properties' => [
                'data' => $properties->items(),
                'meta' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'per_page' => $properties->perPage(),
                    'total' => $properties->total(),
                    'links' => $properties->toArray()['links'],
                ],
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('properties/properties-create', [
            'propertyTypes' => PropertyType::all(),
            'listingMethods' => ListingMethod::all(),
            'listingStatuses' => ListingStatus::all(),
            // Eager load categories with children for hierarchy
            'categoryGroups' => \App\Models\CategoryType::with(['categories' => function($q) {
                $q->whereNull('parent_id')->with('children');
            }])->get(),
            'featureGroups' => \App\Models\FeatureGroup::with('features')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request)
    {
        try {
            $data = $request->validated();
            \Log::info('PropertyController@store validated data', $data);

            // Create property
            $property = \App\Models\Property::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'property_type_id' => $data['property_type_id'],
                'listing_method_id' => $data['listing_method_id'] ?? null,
                'listing_status_id' => $data['listing_status_id'] ?? null,
                'beds' => $data['beds'] ?? null,
                'baths' => $data['baths'] ?? null,
                'parking_spaces' => $data['parking_spaces'] ?? null,
                'ensuites' => $data['ensuites'] ?? null,
                'garage_spaces' => $data['garage_spaces'] ?? null,
                'land_size' => $data['land_size'] ?? null,
                'land_size_unit' => $data['land_size_unit'] ?? null,
                'building_size' => $data['building_size'] ?? null,
                'building_size_unit' => $data['building_size_unit'] ?? null,
                'dynamic_attributes' => $data['dynamic_attributes'] ?? null,
                'slug' => \Str::slug($data['title']) . '-' . uniqid(),
                'expires_at' => now()->addMonths(6),
                'user_id' => \Auth::id(),
            ]);

            \Log::info('Property created', ['id' => $property->id]);

            // Create address using suburb_id directly
            $property->address()->create([
                'suburb_id' => $data['suburb_id'],
                'street_number' => $data['street_number'] ?? null,
                'street_name' => $data['street_name'],
                'unit_number' => $data['unit_number'] ?? null,
                'lot_number' => $data['lot_number'] ?? null,
                'site_name' => $data['site_name'] ?? null,
                'region_name' => $data['region_name'] ?? null,
                'lat' => $data['lat'] ?? null,
                'long' => $data['long'] ?? null,
                'display_address_on_map' => $data['display_address_on_map'] ?? true,
                'display_street_view' => $data['display_street_view'] ?? true,
            ]);

            \Log::info('Address created for property', ['property_id' => $property->id]);

            // Use Inertia-friendly redirect with flash message
            return redirect()->route('properties.show', $property->id)
                ->with('success', 'Property created successfully!');
        } catch (\Throwable $e) {
            \Log::error('PropertyController@store exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'An error occurred while creating the property.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        $property->load(['address', 'propertyType', 'listingMethod', 'listingStatus', 'categories', 'features', 'prices', 'media']);
        return Inertia::render('properties/properties-show', [
            'property' => $property
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        $property->load(['address', 'propertyType', 'listingMethod', 'listingStatus', 'categories', 'features', 'prices', 'media']);
        return Inertia::render('properties/properties-edit', [
            'property' => $property,
            'propertyTypes' => PropertyType::all(),
            'listingMethods' => ListingMethod::all(),
            'listingStatuses' => ListingStatus::all(),
            'categories' => Category::all(),
            'features' => Feature::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, Property $property)
    {
        $property->update($request->validated());
        if ($request->has('categories')) {
            $property->categories()->sync($request->input('categories'));
        }
        if ($request->has('features')) {
            $property->features()->sync($request->input('features'));
        }
        // Update address if present
        if ($property->address) {
            $property->address->update([
                'suburb_id' => $request->input('suburb_id'),
                'street_number' => $request->input('street_number'),
                'street_name' => $request->input('street_name'),
                'unit_number' => $request->input('unit_number'),
                'lat' => $request->input('lat'),
                'long' => $request->input('long'),
                // Optionally: 'display_address_on_map' => $request->input('display_address_on_map'),
                // Optionally: 'display_street_view' => $request->input('display_street_view'),
            ]);
        }
        return redirect()->route('properties.show', $property->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();
        return redirect()->route('properties.index');
    }
}
