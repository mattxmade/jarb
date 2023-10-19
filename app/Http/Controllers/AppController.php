<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use App\Http\Requests\SearchPostRequest;

use Inertia\Inertia;
use Inertia\Response;

class AppController extends Controller
{
  public function index(): Response
  {
      return Inertia::render('Home');
  }

  public function search(SearchPostRequest $request): Response
  {
    $validated = $request->validated();

    $query = $request["query"];
    $apiKey = config('services.reedjobs.key');

    $response = Http::withBasicAuth($apiKey, '')->get("https://www.reed.co.uk/api/1.0/search?$query&resultsToTake=5");

    return Inertia::render('Home', [
      'searchResponse' => $response->json(),
    ]);  
  }
}
