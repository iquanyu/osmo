<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'author',
        'avatar_color',
        'title',
        'content',
        'tags',
        'likes',
        'views',
        'pinned',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'pinned' => 'boolean',
            'likes' => 'integer',
            'views' => 'integer',
        ];
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
}
