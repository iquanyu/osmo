<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutorial extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'title',
        'summary',
        'difficulty',
        'duration',
        'steps',
        'tips',
        'settings',
        'image',
        'status',
        'sort_order',
        'is_featured',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'steps' => 'array',
            'tips' => 'array',
            'settings' => 'array',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
