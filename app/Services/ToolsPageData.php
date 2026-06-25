<?php

namespace App\Services;

class ToolsPageData
{
    public function __construct(
        private SpecsService $specsService,
    ) {}

    /**
     * @return array{profiles: list<array<string, mixed>>}
     */
    public function specsPage(): array
    {
        return [
            'profiles' => $this->specsService->getRecordingProfiles(),
        ];
    }

    /**
     * @return array{accessories: list<array<string, string>>, communityPosts: list<array<string, mixed>>}
     */
    public function accessoriesPage(): array
    {
        return [
            'accessories' => $this->specsService->getCuratedAccessories(),
            'communityPosts' => $this->specsService->getAccessoryCommunityPosts(),
        ];
    }
}
