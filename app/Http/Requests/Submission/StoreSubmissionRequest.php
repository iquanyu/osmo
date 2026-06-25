<?php

namespace App\Http\Requests\Submission;

class StoreSubmissionRequest extends SubmissionBaseRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return $this->submissionRules();
    }
}
