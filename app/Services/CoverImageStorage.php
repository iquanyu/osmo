<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CoverImageStorage
{
    public function store(UploadedFile $file, string $directory = 'covers'): string
    {
        $extension = $file->guessExtension() ?: 'jpg';
        $filename = Str::uuid()->toString().'.'.$extension;

        $path = $file->storeAs($directory, $filename, 'public');

        return Storage::disk('public')->url($path);
    }

    public function deleteIfStored(?string $url): void
    {
        $path = $this->pathFromPublicUrl($url);

        if ($path !== null && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function pathFromPublicUrl(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);

        if (! is_string($path) || ! str_starts_with($path, '/storage/')) {
            return null;
        }

        return ltrim(substr($path, strlen('/storage/')), '/');
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     */
    public function resolveFromRequest(
        $request,
        ?string $existingUrl = null,
        string $directory = 'covers',
    ): string {
        if ($request->hasFile('cover_image')) {
            $this->deleteIfStored($existingUrl);

            return $this->store($request->file('cover_image'), $directory);
        }

        $url = trim((string) $request->input('cover_image_url', ''));

        if ($url !== '') {
            return $url;
        }

        return $existingUrl ?? '';
    }
}
