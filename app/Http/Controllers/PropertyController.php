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
        return Inertia::render('properties/properties-index', [
            'properties' => $properties
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
            'categories' => Category::all(),
            'features' => Feature::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request)
    {
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
