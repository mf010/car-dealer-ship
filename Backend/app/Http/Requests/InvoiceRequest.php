<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'account_id' => 'nullable|exists:accounts,id',
            'amount' => 'required|numeric|decimal:0,2',
            'invoice_date' => 'required|date',
            'car_id' => 'required|exists:cars,id',
            'payed' => 'required|numeric|decimal:0,2',
            'account_cut' => 'required|numeric|decimal:0,2',
        ];
    }

    public function messages()
    {
        return [
            'client_id.required' => 'The client is required.',
            'client_id.exists' => 'The selected client does not exist.',
            'account_id.exists' => 'The selected dealer account does not exist.',
            'amount.required' => 'The invoice amount is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.decimal' => 'The amount must have 2 decimal places.',
            'invoice_date.required' => 'The invoice date is required.',
            'invoice_date.date' => 'Please provide a valid date.',
            'car_id.required' => 'The car is required.',
            'car_id.exists' => 'The selected car does not exist.',
            'payed.required' => 'The paid amount is required.',
            'payed.numeric' => 'The paid amount must be a number.',
            'payed.decimal' => 'The paid amount must have 2 decimal places.',
            'account_cut.required' => 'The dealer cut is required.',
            'account_cut.numeric' => 'The dealer cut must be a number.',
            'account_cut.decimal' => 'The dealer cut must have 2 decimal places.',
        ];
    }
}