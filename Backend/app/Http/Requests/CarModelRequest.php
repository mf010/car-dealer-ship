<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarModelRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'make_id' => 'required|exists:makes,id',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The model name is required.',
            'name.string' => 'The model name must be a string.',
            'name.max' => 'The model name may not be greater than 255 characters.',
            'make_id.required' => 'The make ID is required.',
            'make_id.exists' => 'The selected make does not exist.',
        ];
    }
}