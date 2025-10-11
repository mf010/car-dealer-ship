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
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|decimal:0,2',
            'payment_date' => 'required|date',
        ];
    }

    public function messages()
    {
        return [
            'invoice_id.required' => 'The invoice is required.',
            'invoice_id.exists' => 'The selected invoice does not exist.',
            'amount.required' => 'The payment amount is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.decimal' => 'The amount must have 2 decimal places.',
            'payment_date.required' => 'The payment date is required.',
            'payment_date.date' => 'Please provide a valid date.',
        ];
    }
}