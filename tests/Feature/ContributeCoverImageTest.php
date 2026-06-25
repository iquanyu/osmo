<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ContributeCoverImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_player_can_create_submission_with_cover_image_upload(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('submission-cover.jpg', 1200, 800);

        $response = $this->actingAs($user)->post(route('contribute.store'), [
            ...$this->submissionPayload(),
            'cover_image' => $file,
            'cover_image_url' => '',
        ]);

        $response->assertRedirect();

        $submission = Submission::query()->first();
        $this->assertNotNull($submission);
        $this->assertStringContainsString('/storage/submissions/', $submission->cover_image);

        $storedPath = app(\App\Services\CoverImageStorage::class)
            ->pathFromPublicUrl($submission->cover_image);
        $this->assertNotNull($storedPath);
        Storage::disk('public')->assertExists($storedPath);
    }

    public function test_player_can_update_submission_cover_with_upload(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $submission = Submission::factory()->create([
            'user_id' => $user->id,
            'status' => 'draft',
            'cover_image' => 'https://example.com/old-cover.jpg',
        ]);

        $file = UploadedFile::fake()->image('new-cover.jpg');

        $response = $this->actingAs($user)->put(route('contribute.update', $submission), [
            ...$this->submissionPayload(),
            'cover_image' => $file,
            'cover_image_url' => '',
        ]);

        $response->assertRedirect();

        $submission->refresh();
        $this->assertStringContainsString('/storage/submissions/', $submission->cover_image);
    }

    /**
     * @return array<string, mixed>
     */
    private function submissionPayload(): array
    {
        return [
            'title' => 'Pocket 3 城市夜拍教程',
            'summary' => '一套适合城市夜景的基础教程。',
            'category' => 'night',
            'difficulty' => '新手',
            'duration' => '10 分钟',
            'steps' => ['准备机身', '设置曝光', '开始拍摄'],
            'tips' => ['注意稳定手持'],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'D-Log M (10-bit)',
                'gimbalMode' => '跟随 (Follow)',
                'ndFilter' => '无',
            ],
            'cover_image_url' => 'https://example.com/pocket-3.jpg',
        ];
    }
}
