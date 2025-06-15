<?php

namespace App\Services;

use App\Models\Property;
use App\Models\Media;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class PropertyService
{
    /**
     * Create a new property with images and features.
     */
    public function create(array $data): Property
    {
        try {
            return DB::transaction(function () use ($data) {
                \Log::debug('Creating property with data:', Arr::except($data, ['images']));
                $property = Property::create(
                    Arr::except($data, ['images', 'features', 'new_primary_image_index'])
                );
                $this->syncFeatures($property, $data['features'] ?? []);
                if (!empty($data['images'])) {
                    $this->handleImages(
                        $property, 
                        $data['images'], 
                        $data['new_primary_image_index'] ?? null
                    );
                }
                return $property;
            });
        } catch (\Exception $e) {
            \Log::error('Error creating property:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Update an existing property with images and features.
     */
    public function update(Property $property, array $data): Property
    {
        try {
            return DB::transaction(function () use ($property, $data) {
                \Log::debug('Updating property ID: ' . $property->id . ' with data:', Arr::except($data, ['images']));
                $property->update(
                    Arr::except($data, ['images', 'features', 'new_primary_image_index'])
                );
                $this->syncFeatures($property, $data['features'] ?? []);
                if (!empty($data['images'])) {
                    $this->handleImages(
                        $property, 
                        $data['images'], 
                        $data['new_primary_image_index'] ?? null,
                        !empty($data['replace_images'])
                    );
                }
                return $property;
            });
        } catch (\Exception $e) {
            \Log::error('Error updating property:', [
                'property_id' => $property->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Delete a property and its images.
     */
    public function delete(Property $property): void
    {
        DB::transaction(function () use ($property) {
            foreach ($property->media as $media) {
                Storage::disk('public')->delete($media->path);
                $media->delete();
            }
            $property->features()->detach();
            $property->delete();
        });
    }

    /**
     * Sync property features (one-to-one, update or create).
     */
    protected function syncFeatures(Property $property, array $features): void
    {
        try {
            if (empty($features)) {
                // Optionally, you could delete the feature record if no features provided
                // $property->features()->delete();
                return;
            }
            $property->features()->updateOrCreate(
                ['property_id' => $property->id],
                $features
            );
            \Log::debug('Synced features for property ID: ' . $property->id, [
                'features' => $features
            ]);
        } catch (\Exception $e) {
            \Log::error('Error syncing features for property ID: ' . $property->id, [
                'message' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Handle property images (upload, associate, set primary).
     */
    protected function handleImages(Property $property, array $images, $primaryIndex = null, $replace = false): void
    {
        try {
            if ($replace) {
                foreach ($property->media as $media) {
                    if (Storage::disk('public')->exists($media->path)) {
                        Storage::disk('public')->delete($media->path);
                    }
                    $media->delete();
                }
            }
            foreach ($images as $i => $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('properties', 'public');
                    $isPrimary = ($primaryIndex !== null && $i === (int)$primaryIndex);
                    $media = $property->media()->create(['path' => $path, 'is_primary' => $isPrimary]);
                    if ($isPrimary) {
                        // Unset is_primary on all other media for this property
                        $property->media()->where('id', '!=', $media->id)->update(['is_primary' => false]);
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error handling property images:', [
                'property_id' => $property->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
