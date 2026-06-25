<?php

namespace App\Http\Requests\Submission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

abstract class SubmissionBaseRequest extends FormRequest
{
    /**
     * Shared validation rules for tutorial-style submissions.
     *
     * @return array<string, mixed>
     */
    protected function submissionRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'category' => 'required|string|in:beginner,cinematic,night,vlog,creative',
            'difficulty' => 'required|string|in:新手,进阶,大师',
            'duration' => 'required|string|max:50',
            'steps' => 'required|array',
            'steps.*' => 'string',
            'tips' => 'nullable|array',
            'tips.*' => 'string',
            'settings' => 'required|array',
            'settings.resolution' => 'required|string',
            'settings.colorProfile' => 'required|string',
            'settings.gimbalMode' => 'required|string',
            'settings.ndFilter' => 'required|string',
            'cover_image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:5120',
            'cover_image_url' => 'nullable|string|max:2048',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->hasFile('cover_image')) {
                return;
            }

            $imageUrl = trim((string) $this->input('cover_image_url', ''));

            if ($imageUrl !== '' && ! filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $validator->errors()->add('cover_image_url', '封面图片 URL 格式不正确');
            }
        });
    }
}
