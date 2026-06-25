<?php

namespace Tests\Feature;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSubmissionApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_pending_submission_and_create_tutorial(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $author = User::factory()->create();
        $submission = Submission::factory()->pending()->create([
            'user_id' => $author->id,
            'title' => '海边风光拍摄教程',
            'summary' => '让海边素材更通透。',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.submissions.approve', $submission));

        $response->assertRedirect();

        $submission->refresh();
        $tutorial = Tutorial::query()->where('title', '海边风光拍摄教程')->first();

        $this->assertNotNull($tutorial);
        $this->assertSame(SubmissionStatus::Approved, $submission->status);
        $this->assertSame($admin->id, $submission->reviewed_by);
        $this->assertNotNull($submission->reviewed_at);
        $this->assertSame($tutorial->id, $submission->published_tutorial_id);
    }

    public function test_admin_can_reject_pending_submission_with_note(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $author = User::factory()->create();
        $submission = Submission::factory()->pending()->create([
            'user_id' => $author->id,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.submissions.reject', $submission), [
            'review_note' => '请补充拍摄参数说明。',
        ]);

        $response->assertRedirect();

        $submission->refresh();

        $this->assertSame(SubmissionStatus::Rejected, $submission->status);
        $this->assertSame('请补充拍摄参数说明。', $submission->review_note);
        $this->assertSame($admin->id, $submission->reviewed_by);
        $this->assertNotNull($submission->reviewed_at);
    }

    public function test_admin_cannot_reject_pending_submission_without_note(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $submission = Submission::factory()->pending()->create();

        $response = $this->actingAs($admin)->post(route('admin.submissions.reject', $submission), [
            'review_note' => '',
        ]);

        $response->assertSessionHasErrors('review_note');
        $this->assertSame(SubmissionStatus::Pending, $submission->fresh()->status);
    }

    public function test_admin_cannot_approve_already_processed_submission(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $submission = Submission::factory()->approved()->create([
            'reviewed_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.submissions.approve', $submission));

        $response->assertRedirect();
        $this->assertSame(SubmissionStatus::Approved, $submission->fresh()->status);
        $this->assertSame(0, Tutorial::count());
    }

    public function test_admin_cannot_reject_already_processed_submission(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $submission = Submission::factory()->rejected()->create([
            'reviewed_by' => $admin->id,
            'review_note' => '已有驳回理由',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.submissions.reject', $submission), [
            'review_note' => '新的驳回理由',
        ]);

        $response->assertRedirect();
        $this->assertSame(SubmissionStatus::Rejected, $submission->fresh()->status);
        $this->assertSame('已有驳回理由', $submission->fresh()->review_note);
    }
}
