<a name="readme-top"></a>

<a href="#"><img src="https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white" alt="laravel-badge"/></a>
<a href="#"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="react-badge"/></a>
# <a href="#"><img src="/docs/favicon.svg" width="24"/></a> Jarb | <a href="https://github.com/mattxmade/jarb/blob/main/README.md" target="_blank"> <strong>Live</strong></a>

> ### Job Annotation Research Board

<br>
<div align="center">
  <a href="#"><img src="docs/readme_hero.jpg" width="900"/></a>
  
  ###
  <a href="#"><img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="html-badge"/></a>
  <a href="#"><img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="css-badge"/></a>
  <a href="#"><img src="https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white" alt="sass-badge"/></a>
  <a href="#"><img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white" alt="php-badge"/></a>
  <a href="#"><img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="javascript-badge"/></a>
  <br>
  <a href="#"><img src="https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white" alt="laravel-badge"/></a>
  <a href="#"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="react-badge"/></a>
</div>

## About

<strong><em>Job Annotation Research Board</em> (Jarb)</strong> is an interactive job board powered by <strong><a href="https://github.com/excalidraw/excalidraw">Excalidraw</a></strong> and <strong><a href="https://www.reed.co.uk/developers/Jobseeker">Reed Jobs API</a></strong>. 

Application backend is written in <strong>PHP</strong> and built using the <strong>Laravel</strong> framework which handles API calls, routing and Content Secuirty Policies (CSP). <strong>Vite</strong> is used to compile the application frontend, combining <strong>Blade</strong> templates and <strong>React</strong> written in <strong>TypeScript</strong>.

<strong>Inertia.js</strong> is used to bridge across these architectures.

## Features

<table>
  <thead>
  </thead>
  <tbody>
    <tr><td colspan=2></td></tr>
    <tr>
      <td align=center><strong>Job Search</strong></td>
      <td>Search and find jobs via robust search form</td>
    </tr>
    <tr><td colspan=2></td></tr>
    <tr>
      <td align=center><strong>Interactive Canvas</strong></td>
      <td>Make notes and draw shapes via Excalidraw powered canvas</td>
    </tr>
        <tr><td colspan=2></td></tr>
    <tr>
      <td align=center><strong>Text Highlighter</strong></td>
      <td>Quickly highlight text from job posts and autocopy to canvas</td>
    </tr>
  </tbody>
</table>

<br>

## Server
### API services

Form submissions are sent by **HTTP POST** request and handled server side via controller. 
Upon successful validation, a **HTTP GET** request to the Reed Jobs API is then made. A pagination attribute is added to the end of the request.

> **AppController Details** 📡
```php
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
```

##

### Rules
Within the application, a successful search request is governed by validation rules. 

> **WordFilterRule extract**
```php
class WordsFilterRule implements ValidationRule
{
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
```

<br>

> **Note** 📡
> 
> See <a href="https://github.com/mattxmade/jarb/blob/main/app/Rules/WordsFilterRule.php">**WordsFilterRule.php**</a> for full implementation.

##

### Content Security Policy
To mitigate the risk of Cross Site Scripting attacks, repsonse headers are sent with a CSP and configured using a nonce.

> **CSP Headers Details** 📡
```php

public function handle($request, Closure $next)
{
  return $next($request)->withHeaders([
    'Content-Security-Policy' => "script-src 'strict-dynamic' 'nonce-".Vite::cspNonce()."' http: https:; object-src 'none'; base-uri 'none';",
  ]);
}
```

<br>

## Client

### React UI Components
#### Excalidraw

**Jarb** integrates **Excalidraw** to handle canvas drawing. 

Excalidraw is a powerful React library that allows shapes, arrows and text to be drawn to a HTML5 Canvas. Under the hood Excalidraw uses <a href="https://github.com/rough-stuff/rough">**roughjs**</a>.

Within Jarb, text can be highlighted from any job post and copied directly to the Excalidraw canvas. This is achieved by storing highlighted text in state and programmatically passing this to Excalidraw, creating a new element.

> **Details** 📡
> 
> <a href="https://github.com/mattxmade/jarb/blob/main/resources/js/hooks/useExcalidraw.ts">**useExcalidraw.ts**</a>
>```ts
>const sessionElements = restoreElements(
>  excalidrawAPI.getSceneElements(),
>  null,
>  {
>    refreshDimensions: true,
>    repairBindings: true,
>  }
>);
>
>const sceneData = {
>  elements: [...sessionElements, textElement],
>  appState: excalidrawAPI.getAppState(),
>};
>
>excalidrawAPI.updateScene(sceneData as any);
>lastTextRef.current = id_textElement;
>```

<br>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] <strong>Build UI</strong>
  - [x] Create job search form
  - [x] Integrate Excalidraw React library

- [x] <strong>Build backend</strong>
  - [x] Handle routing
  - [x] Implement API services
  - [x] Add Content Security Policies

##

### Environment

<a href="#"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="nodjs-badge"/></a>

### Build Tools

<a href="#"><img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="vite-badge"/></a>

### Developer Tools

<a href="#"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="npm-badge"/></a>
<a href="#"><img src="https://img.shields.io/badge/composer-%23624B2C.svg?style=for-the-badge&logo=composer&logoColor=white" alt="composer-badge"/></a>
<a href="#"><img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="vscode-badge"/></a>

##

### Deployment

<a href="#"><img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="vercel-badge"/></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
