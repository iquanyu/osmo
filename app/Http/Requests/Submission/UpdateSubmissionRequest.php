<?php

namespace App\Http\Requests\Submission;

use App\Models\Submission;

class UpdateSubmissionRequest extends SubmissionBaseRequest
{
    public function authorize(): bool
    {
        $submission = $this->route('submission');

        return $submission instanceof Submission
            && $this->user()?->can('update', $submission) === true;
    }

    public function rules(): array
    {
        return $this->submissionRules();
    }
}
