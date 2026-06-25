<?php

namespace App\Http\Requests\Admin;

use App\Models\CommunityPost;
use Illuminate\Foundation\Http\FormRequest;

class OfficialAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');

        return $post instanceof CommunityPost
            && $this->user()?->can('officialAnswer', $post) === true;
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string',
        ];
    }
}
