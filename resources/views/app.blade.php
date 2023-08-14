<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="description">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" type="text/css">
        <link rel="icon" type="image/x-icon" href="{{ asset('assets/favicon.ico') }}">
        <title>Title</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/index.jsx'])
        @inertiaHead
    </head>

    <body>
      <header></header>

      <main>
        @inertia
      </main>

      <footer></footer>
    </body>
</html>