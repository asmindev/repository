<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function __invoke()
    {
        $query = request('q', '');
        $category = request('category');
        $department = request('department');
        $sort = request('sort', 'latest');

        $works = Work::where('status', 'published')
            ->where('visibility', 'public');

        if ($query) {
            $works->where(function ($q) use ($query) {
                $q->where('title', 'ilike', "%{$query}%")
                    ->orWhere('abstract', 'ilike', "%{$query}%")
                    ->orWhereHas('department', function ($dq) use ($query) {
                        $dq->where('name', 'ilike', "%{$query}%");
                    })
                    ->orWhereJsonContains('keywords', $query);
            });
        }

        if ($category) {
            $works->where('category_id', $category);
        }

        if ($department) {
            $works->where('department_id', $department);
        }

        if ($sort === 'popular') {
            $works->orderBy('view_count', 'desc');
        } else if ($sort === 'downloads') {
            $works->orderBy('download_count', 'desc');
        } else {
            $works->latest('published_at');
        }

        $results = $works->with(['author', 'category', 'department', 'supervisors'])
            ->paginate(20);

        return Inertia::render('public-pages/search', [
            'results' => $results,
            'query' => $query,
            'filters' => [
                'category' => $category,
                'department' => $department,
                'sort' => $sort,
            ],
        ]);
    }
}
