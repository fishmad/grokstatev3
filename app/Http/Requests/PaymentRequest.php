<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'property_id' => ['nullable', 'exists:properties,id'],
            'invoice_id' => ['required', 'exists:invoices,id'],
            'amount' => ['required', 'numeric'],
            'currency' => ['required', 'string'],
            'gateway_transaction_id' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,paid,failed,refunded'],
            'payment_method_type' => ['required', 'in:card,PayPal'],
            'description' => ['nullable', 'string'],
        ];
    }
}
