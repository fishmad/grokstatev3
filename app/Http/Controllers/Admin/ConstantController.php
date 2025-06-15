<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Constant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ExportConstantsSchema;

class ConstantController extends Controller
{
    // List all constants with pagination
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 5);
        $page = (int) $request->input('page', 1);
        $sort = $request->input('sort', 'updated_at');
        $direction = $request->input('direction', 'desc');
        $search = $request->input('search');

        $query = Constant::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('category', 'like', "%$search%")
                  ->orWhere('key', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhere('usage', 'like', "%$search%")
                  ->orWhere('id', $search);
            });
        }

        $query->orderBy($sort, $direction);

        $constants = $query->paginate($perPage, ['*'], 'page', $page)->withQueryString();

        return inertia('admin/constants/index', [
            'constants' => $constants,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    // Show edit form
    public function edit(Constant $constant)
    {
        $constant->value = is_array($constant->value) ? $constant->value : json_decode($constant->value, true) ?? $constant->value;
        return inertia('admin/constants/edit', [
            'constant' => $constant,
        ]);
    }

    public function create()
    {
        return inertia('admin/constants/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string',
            'key' => 'required|string',
            'value' => 'required',
            'description' => 'nullable|string',
            'usage' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        // Check for unique category/key combination
        if (Constant::where('category', $data['category'])->where('key', $data['key'])->exists()) {
            return redirect()->back()->withErrors(['key' => 'This category/key combination already exists.'])->withInput();
        }
        $data['value'] = is_array($data['value']) ? $data['value'] : json_decode($data['value'], true) ?? $data['value'];
        $constant = Constant::create($data);
        ExportConstantsSchema::dispatch();
        $this->updateCache();

        // Fix: Only return JSON for fetch/AJAX, not for Inertia
        if ($request->ajax() && !$request->inertia()) {
            return response()->json(['constant' => $constant->fresh()]);
        }

        return redirect()->route('admin.constants.edit', $constant->id)->with('success', 'Constant created.');
    }

    // Update a constant
    public function update(Request $request, Constant $constant)
    {
        $data = $request->validate([
            'value' => 'required',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'usage' => 'nullable|string',
        ]);
        $data['value'] = is_array($data['value']) ? $data['value'] : json_decode($data['value'], true) ?? $data['value'];
        $constant->update($data);
        ExportConstantsSchema::dispatch();
        $this->updateCache();

        // Fix: Only return JSON for fetch/AJAX, not for Inertia
        if ($request->ajax() && !$request->inertia()) {
            return response()->json(['constant' => $constant->fresh()]);
        }

        return redirect()->route('admin.constants.index')->with('success', 'Constant updated and cache refreshed.');
    }

    // Delete a constant
    public function destroy(Constant $constant)
    {
        $constant->delete();
        ExportConstantsSchema::dispatch();
        $this->updateCache();
    }

    // Refresh cache and write to JSON file
    public function updateCache()
    {
        // ...existing code...
    }

    // API endpoint for frontend
    public function api()
    {
        // ...existing code...
    }
}
