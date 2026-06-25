<?php

namespace App\Http\Requests\Submission;

use App\Models\Submission;
use Illuminate\Foundation\Http\FormRequest;

class SubmitSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $submission = $this->route('submission');

        return $submission instanceof Submission
            && $this->user()?->can('submit', $submission) === true;
    }

    public function rules(): array
    {
        return [];
    }
}
