<?php

use Illuminate\Support\Facades\Route;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    // ...existing code...
    Route::put('payments/{id}', function ($id, Request $request) {
        $payment = Payment::where('user_id', $request->user()->id)->findOrFail($id);
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'required|string|max:255',
        ]);
        $payment->update($validated);
        return redirect()->route('payments.index');
    })->name('payments.update');
});
