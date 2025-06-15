<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; // Added Inertia

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorite properties.
     */
    public function index()
    {
        $user = Auth::user();
        $favorites = $user->favorites()
            ->with(['property' => function ($query) {
                $query->with(['media', 'user']);
            }])
            ->latest()
            ->paginate(12);

        return Inertia::render('settings/favorites', [
            'favorites' => $favorites,
        ]);
    }

    // Removed create() method

    /**
     * Store a newly created favorite in storage.
     */
    public function store(Request $request, Property $property) // Changed to accept Property model
    {
        $user = Auth::user();

        // Check if already favorited
        if ($user->favorites()->where('property_id', $property->id)->exists()) {
            return back()->with('info', 'This property is already in your favorites.');
        }

        $user->favorites()->create(['property_id' => $property->id]);

        return back()->with('success', 'Property added to favorites.');
    }

    // Removed show() method
    // Removed edit() method
    // Removed update() method

    /**
     * Remove the specified favorite from storage.
     */
    public function destroy(Favorite $favorite)
    {
        // Ensure the authenticated user owns this favorite
        if ($favorite->user_id !== Auth::id()) {
            return back()->with('error', 'You are not authorized to remove this favorite.');
        }

        $favorite->delete();

        return back()->with('success', 'Property removed from favorites.');
    }
}
