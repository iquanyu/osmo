<?php

namespace App\Enums;

enum TutorialCategory: string
{
    case Beginner = 'beginner';
    case Cinematic = 'cinematic';
    case Night = 'night';
    case Vlog = 'vlog';
    case Creative = 'creative';

    public function label(): string
    {
        return match ($this) {
            self::Beginner => '新手指南',
            self::Cinematic => '电影感色彩',
            self::Night => '纯净夜景',
            self::Vlog => '单兵音频Vlog',
            self::Creative => '创意运镜',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $category) => [
                'value' => $category->value,
                'label' => $category->label(),
            ],
            self::cases(),
        );
    }
}
