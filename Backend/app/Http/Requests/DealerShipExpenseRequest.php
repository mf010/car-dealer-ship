<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DealerShipExpenseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|decimal:0,2',
            'expense_date' => 'required|date',
        ];
    }

    public function messages()
    {
        return [
            'description.required' => 'The expense description is required.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 255 characters.',
            'amount.required' => 'The expense amount is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.decimal' => 'The amount must have 2 decimal places.',
            'expense_date.required' => 'The expense date is required.',
            'expense_date.date' => 'Please provide a valid date.',
        ];
    }
}