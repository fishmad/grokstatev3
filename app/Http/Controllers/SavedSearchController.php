<?php

namespace App\Http\Controllers;

use App\Models\SavedSearch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; // Add Inertia

class SavedSearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $savedSearches = SavedSearch::where('user_id', Auth::id())
                                    ->latest()
                                    ->paginate(10);
        return Inertia::render('saved-searches/index', [
            'savedSearches' => $savedSearches,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Pre-fill form with current filter parameters from property index page if available
        $searchParams = $request->only(['location', 'type', 'bedrooms', 'bathrooms', 'min_price', 'max_price']);
        return Inertia::render('saved-searches/create', [
            'searchParams' => $searchParams,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'search_parameters' => 'required|array',
            'search_parameters.location' => 'nullable|string|exists:locations,slug',
            'search_parameters.type' => 'nullable|string|in:sale,rent',
            'search_parameters.bedrooms' => 'nullable|integer|min:0',
            'search_parameters.bathrooms' => 'nullable|integer|min:0',
            'search_parameters.min_price' => 'nullable|numeric|min:0',
            'search_parameters.max_price' => 'nullable|numeric|min:0|gte:search_parameters.min_price',
            'receive_alerts' => 'boolean',
        ]);

        SavedSearch::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'search_parameters' => $request->search_parameters,
            'receive_alerts' => $request->boolean('receive_alerts'),
        ]);

        return redirect()->route('saved-searches.index')->with('success', 'Search criteria saved successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SavedSearch $savedSearch)
    {
        // Redirect to property index with these search parameters
        if ($savedSearch->user_id !== Auth::id()) {
            abort(403);
        }
        return redirect()->route('properties.index', $savedSearch->search_parameters);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SavedSearch $savedSearch)
    {
        if ($savedSearch->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('saved-searches/edit', [
            'savedSearch' => $savedSearch,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SavedSearch $savedSearch)
    {
        if ($savedSearch->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            // No validation for search_parameters on update, assume they are not changed via this form
            // or if they are, ensure they are passed correctly and validated.
            'receive_alerts' => 'boolean',
        ]);

        $savedSearch->update([
            'name' => $request->name,
            'receive_alerts' => $request->boolean('receive_alerts'),
        ]);

        return redirect()->route('saved-searches.index')->with('success', 'Saved search updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SavedSearch $savedSearch)
    {
        if ($savedSearch->user_id !== Auth::id()) {
            abort(403);
        }

        $savedSearch->delete();

        return redirect()->route('saved-searches.index')->with('success', 'Saved search deleted successfully.');
    }
}
