<?php

namespace App\Http\Controllers;

use App\Services\ToolsPageData;
use Inertia\Inertia;
use Inertia\Response;

class ToolsController extends Controller
{
    public function __construct(
        private ToolsPageData $toolsPageData,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tools/index');
    }

    public function ndCalculator(): Response
    {
        return Inertia::render('tools/nd-calculator');
    }

    public function specs(): Response
    {
        return Inertia::render('tools/specs', $this->toolsPageData->specsPage());
    }

    public function accessories(): Response
    {
        return Inertia::render(
            'tools/accessories',
            $this->toolsPageData->accessoriesPage(),
        );
    }
}
