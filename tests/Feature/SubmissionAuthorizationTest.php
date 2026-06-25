<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmissionAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_submission_owner_can_update_draft_submission(): void
    {
        $owner = User::factory()->create();
        $submission = Submission::factory()->draft()->create([
            'user_id' => $owner->id,
        ]);

        $response = $this->actingAs($owner)->put(route('contribute.update', $submission), $this->submissionPayload([
            'title' => 'Updated title',
        ]));

        $response->assertRedirect();

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'title' => 'Updated title',
        ]);
    }

    public function test_other_users_cannot_update_someone_elses_submission(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $submission = Submission::factory()->draft()->create([
            'user_id' => $owner->id,
        ]);

        $response = $this->actingAs($other)->put(route('contribute.update', $submission), $this->submissionPayload([
            'title' => 'Forbidden title',
        ]));

        $response->assertForbidden();
    }

    public function test_submission_owner_can_submit_draft_for_review(): void
    {
        $owner = User::factory()->create();
        $submission = Submission::factory()->draft()->create([
            'user_id' => $owner->id,
        ]);

        $response = $this->actingAs($owner)->post(route('contribute.submit', $submission));

        $response->assertRedirect();

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'status' => 'pending',
        ]);
    }

    private function submissionPayload(array $overrides = []): array
    {
        return array_merge([
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
        ], $overrides);
    }
}
