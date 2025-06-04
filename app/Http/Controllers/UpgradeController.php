<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\Upgrade;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UpgradeController extends Controller
{
    public function store(Request $request, Property $property)
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'type' => 'required|string',
            'payment_token' => 'required|string',
        ]);

        // Payment processing logic would go here (stubbed for now)
        // $paymentResult = PaymentService::charge($validated['payment_token'], ...);

        $upgrade = Upgrade::create([
            'property_id' => $property->id,
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'status' => 'pending',
        ]);

        // Return to property show page with success message
        return redirect()->route('properties.show', $property)->with('success', 'Upgrade requested.');
    }
}
