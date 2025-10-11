<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric|decimal:0,2',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The account name is required.',
            'name.string' => 'The account name must be a string.',
            'name.max' => 'The account name may not be greater than 255 characters.',
            'phone.string' => 'The phone number must be a string.',
            'phone.max' => 'The phone number may not be greater than 255 characters.',
            'balance.numeric' => 'The balance must be a number.',
            'balance.decimal' => 'The balance must have 2 decimal places.',
        ];
    }
}