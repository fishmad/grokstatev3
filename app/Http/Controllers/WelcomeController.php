<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $properties = Property::with(['media', 'propertyType', 'address'])
            ->orderByDesc('created_at')
            ->take(8)
            ->get();
        return Inertia::render('welcome', [
            'properties' => $properties,
        ]);
    }
}
