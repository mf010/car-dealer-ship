<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
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
            'personal_id' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric|decimal:0,2',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The client name is required.',
            'name.string' => 'The client name must be a string.',
            'name.max' => 'The client name may not be greater than 255 characters.',
            'phone.string' => 'The phone number must be a string.',
            'phone.max' => 'The phone number may not be greater than 255 characters.',
            'personal_id.string' => 'The personal ID must be a string.',
            'personal_id.max' => 'The personal ID may not be greater than 255 characters.',
            'address.string' => 'The address must be a string.',
            'address.max' => 'The address may not be greater than 255 characters.',
            'balance.numeric' => 'The balance must be a number.',
            'balance.decimal' => 'The balance must have 2 decimal places.',
        ];
    }
}