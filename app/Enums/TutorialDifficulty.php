<?php

namespace App\Enums;

enum TutorialDifficulty: string
{
    case Beginner = '新手';
    case Intermediate = '进阶';
    case Master = '大师';

    public function label(): string
    {
        return $this->value;
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
            fn (self $difficulty) => [
                'value' => $difficulty->value,
                'label' => $difficulty->label(),
            ],
            self::cases(),
        );
    }
}
