<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class TutorialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminRole() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category' => 'required|string|in:beginner,cinematic,night,vlog,creative',
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
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
            'image' => 'nullable|string|max:2048',
            'status' => 'required|string|in:draft,published',
            'sort_order' => 'nullable|integer|min:0|max:999999',
            'is_featured' => 'nullable|boolean',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $hasUpload = $this->hasFile('cover_image');
            $imageUrl = trim((string) $this->input('image', ''));
            $isUpdate = $this->route('tutorial') !== null;

            if (! $hasUpload && $imageUrl === '' && ! $isUpdate) {
                $validator->errors()->add('cover_image', '请上传封面图片或填写图片 URL');
            }

            if (! $hasUpload && $imageUrl !== '' && ! filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $validator->errors()->add('image', '封面图片 URL 格式不正确');
            }
        });
    }
}
