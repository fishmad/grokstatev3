<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ListingMethod;

class ListingMethodController extends Controller
{
    public function index()
    {
        $methods = ListingMethod::all(['id', 'name', 'slug', 'display_names', 'description']);
        return response()->json($methods);
    }

    public function edit($id)
    {
        $method = ListingMethod::findOrFail($id, ['id', 'name', 'slug', 'display_names', 'description']);
        return response()->json($method);
    }

    public function update(Request $request, $id)
    {
        $method = ListingMethod::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:listing_methods,slug,' . $id,
            'display_names' => 'required|array',
            'display_names.*' => 'string|max:255',
            'description' => 'nullable|string',
        ]);
        $method->update($validated);
        return response()->json($method);
    }
}
