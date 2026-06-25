<?php

namespace Database\Factories;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Submission>
 */
class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'tutorial',
            'status' => SubmissionStatus::Draft,
            'title' => fake()->sentence(6),
            'summary' => fake()->paragraph(2),
            'cover_image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            'details' => [
                'category' => fake()->randomElement(['beginner', 'cinematic', 'night', 'vlog', 'creative']),
                'difficulty' => fake()->randomElement(['新手', '进阶', '大师']),
                'duration' => fake()->randomElement(['5 分钟', '10 分钟', '15 分钟', '20 分钟']),
                'steps' => [
                    fake()->sentence(10),
                    fake()->sentence(10),
                    fake()->sentence(10),
                ],
                'tips' => [
                    fake()->sentence(8),
                    fake()->sentence(8),
                ],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => fake()->randomElement(['D-Log M (10-bit)', 'Normal 8-bit', 'HLG (10-bit)']),
                    'gimbalMode' => fake()->randomElement(['跟随 (Follow)', '锁定 (Tilt Locked)', 'FPV']),
                    'ndFilter' => fake()->randomElement(['无', 'ND8', 'ND16', 'ND32', 'ND64']),
                ],
            ],
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => SubmissionStatus::Pending,
            'submitted_at' => now(),
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => SubmissionStatus::Approved,
            'submitted_at' => now()->subDays(2),
            'reviewed_at' => now()->subDay(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => SubmissionStatus::Rejected,
            'submitted_at' => now()->subDays(3),
            'reviewed_at' => now()->subDays(2),
            'review_note' => fake()->sentence(8),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => SubmissionStatus::Draft,
            'submitted_at' => null,
            'reviewed_at' => null,
            'reviewed_by' => null,
            'review_note' => null,
            'published_tutorial_id' => null,
        ]);
    }
}
