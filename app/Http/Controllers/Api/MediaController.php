<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\Property;
use App\Http\Requests\MediaUploadRequest;

class MediaController extends Controller
{
    public function index()
    {
        $media = Media::paginate(20);
        return JsonResource::collection($media);
    }

    public function show($id)
    {
        $media = Media::findOrFail($id);
        return new JsonResource($media);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'media_type' => 'required|string',
            'url' => 'required|url',
            'order' => 'nullable|integer',
            'file_size' => 'nullable|integer',
            'mime_type' => 'nullable|string',
        ]);
        $media = Media::create($data);
        return new JsonResource($media);
    }

    public function update(Request $request, $id)
    {
        $media = Media::findOrFail($id);
        $data = $request->validate([
            'media_type' => 'sometimes|string',
            'url' => 'sometimes|url',
            'order' => 'nullable|integer',
            'file_size' => 'nullable|integer',
            'mime_type' => 'nullable|string',
        ]);
        $media->update($data);
        return new JsonResource($media);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        $media->delete();
        return response()->json(['message' => 'Media deleted']);
    }

    /**
     * Upload and attach a media file to a property using Spatie Media Library.
     */
    public function upload(MediaUploadRequest $request)
    {
        $data = $request->validated();
        $property = \App\Models\Property::findOrFail($data['property_id']);
        $mediaItem = $property->media()->create([
            'media_type' => $data['media_type'],
            'order' => $data['order'] ?? null,
            'file_size' => $request->file('file')->getSize(),
            'mime_type' => $request->file('file')->getMimeType(),
        ]);

        $mediaItem->addMediaFromRequest('file')
            ->toMediaCollection($data['media_type']);

        return new JsonResource($mediaItem->fresh());
    }

    /**
     * Remove a media file and its record.
     */
    public function removeFile($id)
    {
        $media = Media::findOrFail($id);
        $media->clearMediaCollection($media->media_type);
        $media->delete();
        return response()->json(['message' => 'Media file and record deleted']);
    }
}
