<?php

namespace App\Http\Requests\Admin;

use App\Models\Submission;
use Illuminate\Foundation\Http\FormRequest;

class RejectSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $submission = $this->route('submission');

        return $submission instanceof Submission
            && $this->user()?->can('reject', $submission) === true;
    }

    public function rules(): array
    {
        return [
            'review_note' => 'required|string|max:500',
        ];
    }
}
