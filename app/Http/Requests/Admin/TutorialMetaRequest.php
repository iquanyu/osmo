<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TutorialMetaRequest extends FormRequest
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
            'status' => 'nullable|string|in:draft,published',
            'sort_order' => 'nullable|integer|min:0|max:999999',
            'is_featured' => 'nullable|boolean',
        ];
    }
}
