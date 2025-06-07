<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Store uploaded media for a property.
     */
    public function store(Request $request, Property $property)
    {
        $this->authorize('update', $property);
        $request->validate([
            'media' => 'required|array',
            'media.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mov,pdf,doc,docx|max:10240',
        ]);

        $uploaded = [];
        foreach ($request->file('media', []) as $file) {
            $type = $this->detectType($file->getMimeType());
            $path = $file->store('properties/media', 'public');
            $media = Media::create([
                'property_id' => $property->id,
                'type' => $type,
                'url' => Storage::disk('public')->url($path),
            ]);
            $uploaded[] = $media;
        }

        return response()->json(['success' => true, 'media' => $uploaded]);
    }

    /**
     * Detect media type from mime.
     */
    protected function detectType($mime)
    {
        if (Str::contains($mime, ['image'])) return 'image';
        if (Str::contains($mime, ['video'])) return 'video';
        return 'document';
    }
}
