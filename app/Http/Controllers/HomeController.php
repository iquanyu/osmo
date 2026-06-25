<?php

namespace App\Http\Controllers;

use App\Services\CommunityPageData;
use App\Services\HomeOverviewService;
use App\Services\TutorialPageData;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private HomeOverviewService $homeOverviewService,
    ) {}

    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'featuredTutorials' => TutorialPageData::listCollection(
                $this->homeOverviewService->getFeaturedTutorials(3),
            ),
            'latestTutorials' => TutorialPageData::listCollection(
                $this->homeOverviewService->getLatestTutorials(6),
            ),
            'recentCommunityPosts' => CommunityPageData::listCollection(
                $this->homeOverviewService->getRecentCommunityPosts(3),
            ),
        ]);
    }
}
