<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('user')->paginate(20);
        return JsonResource::collection($invoices);
    }

    public function show($id)
    {
        $invoice = Invoice::with('user')->findOrFail($id);
        return new JsonResource($invoice);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'currency' => 'required|string',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'status' => 'required|string',
            'pdf_path' => 'nullable|string',
        ]);
        $invoice = Invoice::create($data);
        return new JsonResource($invoice);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);
        $data = $request->validate([
            'total_amount' => 'sometimes|numeric',
            'currency' => 'sometimes|string',
            'invoice_date' => 'sometimes|date',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|string',
            'pdf_path' => 'nullable|string',
        ]);
        $invoice->update($data);
        return new JsonResource($invoice);
    }

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted']);
    }
}
