<?php

namespace App\Services;

use App\Models\Tutorial;
use Illuminate\Support\Collection;

class TutorialPageData
{
    /**
     * @return array<string, mixed>
     */
    public static function listItem(Tutorial $tutorial): array
    {
        $settings = $tutorial->settings ?? [];

        return [
            'id' => $tutorial->id,
            'category' => $tutorial->category,
            'title' => $tutorial->title,
            'summary' => $tutorial->summary,
            'difficulty' => $tutorial->difficulty,
            'duration' => $tutorial->duration,
            'image' => $tutorial->image,
            'is_featured' => (bool) $tutorial->is_featured,
            'settings' => [
                'resolution' => $settings['resolution'] ?? '',
                'colorProfile' => $settings['colorProfile'] ?? '',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function detail(Tutorial $tutorial): array
    {
        return [
            ...self::listItem($tutorial),
            'settings' => $tutorial->settings ?? [],
            'steps' => $tutorial->steps ?? [],
            'tips' => $tutorial->tips ?? [],
        ];
    }

    /**
     * @param  Collection<int, Tutorial>  $tutorials
     * @return array<int, array<string, mixed>>
     */
    public static function listCollection(Collection $tutorials): array
    {
        return $tutorials
            ->map(fn (Tutorial $tutorial): array => self::listItem($tutorial))
            ->all();
    }
}
