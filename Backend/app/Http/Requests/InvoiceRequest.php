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
            'account_cut' => 'nullable|numeric|decimal:0,2',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $accountId = $this->input('account_id');
            $accountCut = $this->input('account_cut');

            // If one is provided, both must be provided
            if (($accountId && !$accountCut) || (!$accountId && $accountCut)) {
                $validator->errors()->add('account_id', 'Both dealer account and dealer cut must be provided together, or leave both empty.');
                $validator->errors()->add('account_cut', 'Both dealer account and dealer cut must be provided together, or leave both empty.');
            }
        });
    }
}