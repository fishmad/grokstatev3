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
use App\Models\Country;
use App\Models\State;
use App\Models\Suburb;
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
    public function index(Request $request)
    {
        // NEW: Add filters for search, type, location, and price
        $filters = $request->only(['search', 'property_type_id', 'country_id', 'state_id', 'suburb_id', 'price_min', 'price_max']);
        $sort = $request->query('sort', '');

        // Cast suburb_id to int if present
        if (isset($filters['suburb_id'])) {
            $filters['suburb_id'] = (int) $filters['suburb_id'] ?: null;
        }

        $query = Property::query()
            ->with(['address', 'propertyType', 'listingMethod', 'listingStatus', 'categories', 'features', 'price', 'media'])
            ->where('user_id', Auth::id())
            // NEW: Apply search filters
            ->when($filters['search'] ?? null, function ($q) use ($filters) {
                $q->where(function ($q2) use ($filters) {
                    $q2->where('title', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('description', 'like', '%' . $filters['search'] . '%');
                });
            })
            ->when($filters['property_type_id'] ?? null, function ($q) use ($filters) {
                $q->where('property_type_id', $filters['property_type_id']);
            })
            // Location filtering: country > state > suburb (most specific wins)
            ->when($filters['suburb_id'] ?? null, function ($q) use ($filters) {
                $q->whereHas('address', fn ($a) => $a->where('suburb_id', $filters['suburb_id']));
            }, function ($q) use ($filters) {
                if ($filters['state_id'] ?? null) {
                    $stateSuburbIds = \App\Models\Suburb::where('state_id', $filters['state_id'])->pluck('id');
                    $q->whereHas('address', fn ($a) => $a->whereIn('suburb_id', $stateSuburbIds));
                } elseif ($filters['country_id'] ?? null) {
                    $countryStateIds = \App\Models\State::where('country_id', $filters['country_id'])->pluck('id');
                    $countrySuburbIds = \App\Models\Suburb::whereIn('state_id', $countryStateIds)->pluck('id');
                    $q->whereHas('address', fn ($a) => $a->whereIn('suburb_id', $countrySuburbIds));
                }
            })
            // Price range filter (excludes penalize_search = true)
            ->when(isset($filters['price_min']) || isset($filters['price_max']), function ($q) use ($filters) {
                $q->whereHas('price', fn ($p) => $p->where('penalize_search', false)
                    ->where(function ($p) use ($filters) {
                        if ($filters['price_min'] ?? null) {
                            $p->where('amount', '>=', $filters['price_min'])
                              ->orWhere('range_min', '>=', $filters['price_min']);
                        }
                        if ($filters['price_max'] ?? null) {
                            $p->where('amount', '<=', $filters['price_max'])
                              ->orWhere('range_max', '<=', $filters['price_max']);
                        }
                    }));
            })
            // Price sorting
            ->when($sort === 'price_asc', fn ($q) => $q->orderByRaw('
                COALESCE(
                    (SELECT amount FROM prices WHERE prices.property_id = properties.id),
                    (SELECT range_min FROM prices WHERE prices.property_id = properties.id)
                ) ASC,
                (SELECT penalize_search FROM prices WHERE prices.property_id = properties.id) ASC
            '))
            ->when($sort === 'price_desc', fn ($q) => $q->orderByRaw('
                COALESCE(
                    (SELECT amount FROM prices WHERE prices.property_id = properties.id),
                    (SELECT range_max FROM prices WHERE prices.property_id = properties.id)
                ) DESC,
                (SELECT penalize_search FROM prices WHERE prices.property_id = properties.id) ASC
            '))
            // Default sorting
            ->orderByDesc('updated_at')
            ->orderByDesc('created_at');

        $properties = $query->paginate(10);
        // Eager load nested relationships for address > suburb > state > country
        $properties->getCollection()->load(['address.suburb.state.country']);

        // Return paginator directly (not ->items()) for correct pagination and data
        return Inertia::render('properties/properties-index', [
            'properties' => $properties,
            'filters' => $filters,
            'countries' => Country::all(),
            'states' => $filters['country_id'] ?? null ? State::where('country_id', $filters['country_id'])->get() : [],
            'suburbs' => $filters['state_id'] ?? null ? Suburb::where('state_id', $filters['state_id'])->get() : [],
            'propertyTypes' => PropertyType::all(),
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
            // NEW: Add geolocation data for address dropdowns
            'countries' => Country::all(),
            'states' => [],
            'suburbs' => [],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request)
    {
        \Log::info('DEBUG: Incoming address payload', ['address' => $request->input('address')]);
        try {
            $data = $request->validated();
            \Log::info('PropertyController@store validated data', $data);

            // --- Address lookup and ID resolution ---
            $addressData = $data['address'];
            $country = Country::where('name', $addressData['country'] ?? '')->first();
            $state = null;
            $suburb = null;
            if ($country) {
                $state = State::where('name', $addressData['state'] ?? '')
                    ->where('country_id', $country->id)
                    ->first();
                if ($state) {
                    $suburb = Suburb::where('name', $addressData['suburb'] ?? '')
                        ->where('state_id', $state->id)
                        ->where('postcode', $addressData['postcode'] ?? null)
                        ->first();
                }
            }
            // ---

            // Create property
            $property = Property::create([
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
                'user_id' => Auth::id(),
            ]);

            \Log::info('Property created', ['id' => $property->id]);

            // Create address (use nested address fields)
            $property->address()->create([
                'suburb_id' => $suburb ? $suburb->id : null,
                'state_id' => $state ? $state->id : null,
                'country_id' => $country ? $country->id : null,
                'street_number' => $addressData['street_number'] ?? null,
                'street_name' => $addressData['street_name'] ?? null,
                'unit_number' => $addressData['unit_number'] ?? null,
                'lot_number' => $addressData['lot_number'] ?? null,
                'site_name' => $addressData['site_name'] ?? null,
                'region_name' => $addressData['region_name'] ?? null,
                'lat' => $addressData['lat'] ?? null,
                'long' => $addressData['long'] ?? null,
                'display_address_on_map' => $addressData['display_address_on_map'] ?? true,
                'display_street_view' => $addressData['display_street_view'] ?? true,
            ]);

            \Log::info('Address created for property', ['property_id' => $property->id]);

            // NEW: Create price if provided
            if (isset($data['price'])) {
                $priceData = $data['price'];
                // Set penalize_search for non-numeric or hidden prices
                $priceData['penalize_search'] = ($priceData['penalize_search'] ?? false) ||
                    (empty($priceData['amount']) && $priceData['price_type'] !== 'offers_between') ||
                    ($priceData['hide_amount'] ?? false) ||
                    in_array($priceData['price_type'], ['enquire', 'contact', 'call', 'tba']);
                $property->price()->create($priceData);
                \Log::info('Price created for property', ['property_id' => $property->id, 'price' => $priceData]);
            }

            // NEW: Sync categories and features if provided
            if (isset($data['categories'])) {
                $property->categories()->sync($data['categories']);
            }
            if (isset($data['features'])) {
                $property->features()->sync($data['features']);
            }

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
        $property->load([
            'address.suburb.state.country',
            'address.state',
            'address.country',
            'propertyType',
            'listingMethod',
            'listingStatus',
            'categories',
            'features',
            'price',
            'media',
        ]);
        return Inertia::render('properties/properties-show', [
            'property' => $property
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        // NEW: Load price relationship
        $property->load(['address', 'propertyType', 'listingMethod', 'listingStatus', 'categories', 'features', 'price', 'media']);
        return Inertia::render('properties/properties-edit', [
            'property' => $property,
            'propertyTypes' => PropertyType::all(),
            'listingMethods' => ListingMethod::all(),
            'listingStatuses' => ListingStatus::all(),
            // Eager load categories with children for hierarchy (match create)
            'categoryGroups' => \App\Models\CategoryType::with(['categories' => function($q) {
                $q->whereNull('parent_id')->with('children');
            }])->get(),
            'featureGroups' => \App\Models\FeatureGroup::with('features')->get(),
            // Add geolocation data for address dropdowns
            'countries' => Country::all(),
            'states' => $property->address && $property->address->country_id ? State::where('country_id', $property->address->country_id)->get() : [],
            'suburbs' => $property->address && $property->address->state_id ? Suburb::where('state_id', $property->address->state_id)->get() : [],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, Property $property)
    {
        try {
            $data = $request->validated();
            \Log::info('PropertyController@update validated data', $data);

            // Update property
            $property->update([
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
            ]);

            // Update address (use nested address fields)
            if (isset($data['address']) && $property->address) {
                $property->address->update([
                    'suburb_id' => $data['address']['suburb_id'] ?? null,
                    'street_number' => $data['address']['street_number'] ?? null,
                    'street_name' => $data['address']['street_name'] ?? null,
                    'unit_number' => $data['address']['unit_number'] ?? null,
                    'lot_number' => $data['address']['lot_number'] ?? null,
                    'site_name' => $data['address']['site_name'] ?? null,
                    'region_name' => $data['address']['region_name'] ?? null,
                    'lat' => $data['address']['lat'] ?? null,
                    'long' => $data['address']['long'] ?? null,
                    'display_address_on_map' => $data['address']['display_address_on_map'] ?? true,
                    'display_street_view' => $data['address']['display_street_view'] ?? true,
                ]);
            }

            // NEW: Update or create price
            if (isset($data['price'])) {
                $priceData = $data['price'];
                $priceData['penalize_search'] = ($priceData['penalize_search'] ?? false) ||
                    (empty($priceData['amount']) && $priceData['price_type'] !== 'offers_between') ||
                    ($priceData['hide_amount'] ?? false) ||
                    in_array($priceData['price_type'], ['enquire', 'contact', 'call', 'tba']);
                $property->price()->updateOrCreate([], $priceData);
                \Log::info('Price updated for property', ['property_id' => $property->id, 'price' => $priceData]);
            }

            // Existing: Sync categories and features
            if (isset($data['categories'])) {
                $property->categories()->sync($data['categories']);
            }
            if (isset($data['features'])) {
                $property->features()->sync($data['features']);
            }

            return redirect()->route('properties.show', $property->id)
                ->with('success', 'Property updated successfully!');
        } catch (\Throwable $e) {
            \Log::error('PropertyController@update exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'An error occurred while updating the property.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();
        return redirect()->route('properties.index')
            ->with('success', 'Property deleted successfully!');
    }
}