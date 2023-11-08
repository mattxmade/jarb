<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Loadscreen extends Component
{
    /**
     * Loadscreen title.
     *
     * @var string
     */
    public $title;

    /**
     * Loadscreen HTML elements.
     *
     * @var array
     */
    public $html = array();

    /**
     * Loadscreen content.
     *
     * @var object
     */
    public $content;
 
    /**
     * Create the component instance.
     *
     * @param  string $title
     * @param  array  $html
     * @param  object $content
     * @return void
     */

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
        $this->content = json_decode(file_get_contents(database_path('data/content.json')));
        $this->title = $this->content->{'title'};
        $this->html = $this->content->{'html'};
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
      return view('components.loadscreen');
    }
}
