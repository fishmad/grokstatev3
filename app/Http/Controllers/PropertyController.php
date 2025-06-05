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
        \Log::info('PropertyController@store debug', [
            'user' => \Auth::user(),
            'roles' => \Auth::user() ? \Auth::user()->getRoleNames() : null,
            'is_authenticated' => \Auth::check(),
        ]);

        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $data['expires_at'] = now()->addMonths(6);
        $property = Property::create($data);
        // Attach categories, features, prices, etc. if present
        if ($request->has('categories')) {
            $property->categories()->sync($request->input('categories'));
        }
        if ($request->has('features')) {
            $property->features()->sync($request->input('features'));
        }
        // Save address if present
        if (!empty($data['address']) && is_array($data['address'])) {
            $addressData = $data['address'];
            $addressData['property_id'] = $property->id;
            // Only allow fillable fields
            $address = new Address();
            $fillable = $address->getFillable();
            $filtered = array_intersect_key($addressData, array_flip($fillable));
            Address::create($filtered);
        }
        return redirect()->route('properties.show', $property->id);
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
