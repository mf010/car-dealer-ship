<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MakeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The make name is required.',
            'name.string' => 'The make name must be a string.',
            'name.max' => 'The make name may not be greater than 255 characters.',
        ];
    }
}