<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'car_model_id' => 'required|exists:car_models,id',
            'status' => 'sometimes|required|in:available,sold',
            'purchase_price' => 'required|numeric|decimal:0,2',
            'total_expenses' => 'nullable|numeric|decimal:0,2',
        ];
    }

    public function messages()
    {
        return [
            'car_model_id.required' => 'The car model is required.',
            'car_model_id.exists' => 'The selected car model does not exist.',
            'status.required' => 'The status field is required.',
            'status.in' => 'The status must be either available or sold.',
            'purchase_price.required' => 'The purchase price is required.',
            'purchase_price.numeric' => 'The purchase price must be a number.',
            'purchase_price.decimal' => 'The purchase price must have 2 decimal places.',
            'total_expenses.numeric' => 'The total expenses must be a number.',
            'total_expenses.decimal' => 'The total expenses must have 2 decimal places.',
        ];
    }
}