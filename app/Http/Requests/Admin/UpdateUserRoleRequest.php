<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminRole() ?? false;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', 'in:admin,player'],
            'mode' => ['nullable', 'string', 'in:role,password,view,disable,enable'],
        ];
    }
}
