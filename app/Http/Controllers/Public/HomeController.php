<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        $featuredWorks = Work::where('status', 'published')
            ->where('visibility', 'public')
            ->with(['author', 'category', 'department'])
            ->latest('published_at')
            ->limit(6)
            ->get();

        $recentWorks = Work::where('status', 'published')
            ->where('visibility', 'public')
            ->with(['author', 'category', 'department'])
            ->latest('published_at')
            ->limit(10)
            ->get();

        return Inertia::render('public-pages/home', [
            'featuredWorks' => $featuredWorks,
            'recentWorks' => $recentWorks,
        ]);
    }
}
