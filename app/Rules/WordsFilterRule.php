<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WordsFilterRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
      $words = [];
      $words = array_merge($words, json_decode(file_get_contents(resource_path('json/words.json'))));

      $pass = true;

      foreach($words as $word) {
        if ( str_contains( strtolower($value), strtolower($word) ) ) { 
          $pass = false;
        }
      }

      if (!$pass) {
        $fail(':attribute search request failed');
      }
    }
}

// https://laravel.com/docs/10.x/validation#custom-validation-rules
// https://github.com/DivineOmega/is_offensive/blob/master/src/BadWordsLoader.php
// https://laracasts.com/discuss/channels/laravel/get-file-get-contents-of-a-view

