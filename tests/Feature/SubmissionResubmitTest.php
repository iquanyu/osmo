<?php

namespace Tests\Feature;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmissionResubmitTest extends TestCase
{
    use RefreshDatabase;

    public function test_rejected_submission_resubmit_clears_review_fields(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $author = User::factory()->create();

        $submission = Submission::factory()->rejected()->create([
            'user_id' => $author->id,
            'reviewed_by' => $admin->id,
            'review_note' => '请补充步骤截图',
        ]);

        $response = $this->actingAs($author)->post(route('contribute.submit', $submission));

        $response->assertRedirect();

        $submission->refresh();

        $this->assertSame(SubmissionStatus::Pending, $submission->status);
        $this->assertNull($submission->review_note);
        $this->assertNull($submission->reviewed_by);
        $this->assertNull($submission->reviewed_at);
        $this->assertNotNull($submission->submitted_at);
    }

    public function test_pending_submission_cannot_be_resubmitted(): void
    {
        $author = User::factory()->create();
        $submission = Submission::factory()->pending()->create([
            'user_id' => $author->id,
        ]);

        $response = $this->actingAs($author)->post(route('contribute.submit', $submission));

        $response->assertForbidden();
        $this->assertSame(SubmissionStatus::Pending, $submission->fresh()->status);
    }
}
