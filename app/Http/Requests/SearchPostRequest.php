<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\WordsFilterRule;

class SearchPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // return false;
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
          'id' => 'required|max:21',
          'query' => 'required',
          'keywords' => ['bail', 'sometimes', new WordsFilterRule],
          'locationName' => ['bail', 'sometimes', new WordsFilterRule],
          'employerProfileId' => ['bail', 'sometimes', new WordsFilterRule],
        ];
    }
}

// https://laravel.com/docs/10.x/validation#custom-validation-rules
// https://laravel.com/docs/10.x/validation#quick-writing-the-validation-logic
// https://laravel.com/docs/10.x/validation#rule-bail
// https://laravel.com/docs/10.x/validation#stopping-on-first-validation-failure