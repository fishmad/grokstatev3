<?php

use Illuminate\Support\Facades\Route;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('payments', function (Request $request) {
        $payments = Payment::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('payments', [
            'payments' => $payments,
        ]);
    })->name('payments.index');

    Route::post('payments', function (Request $request) {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'required|string|max:255',
        ]);
        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'currency' => 'AUD',
            'status' => 'pending',
            'description' => $validated['description'],
        ]);
        return redirect()->route('payments.index');
    })->name('payments.store');

    Route::delete('payments/{id}', function ($id, Request $request) {
        $payment = Payment::where('user_id', $request->user()->id)->findOrFail($id);
        $payment->delete();
        return redirect()->route('payments.index');
    })->name('payments.destroy');
});
