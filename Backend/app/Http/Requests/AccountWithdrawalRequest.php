<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountWithdrawalRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|decimal:0,2',
            'withdrawal_date' => 'required|date',
        ];
    }

    public function messages()
    {
        return [
            'account_id.required' => 'The account is required.',
            'account_id.exists' => 'The selected account does not exist.',
            'amount.required' => 'The withdrawal amount is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.decimal' => 'The amount must have 2 decimal places.',
            'withdrawal_date.required' => 'The withdrawal date is required.',
            'withdrawal_date.date' => 'Please provide a valid date.',
        ];
    }
}