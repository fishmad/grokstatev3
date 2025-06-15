<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\Controller;

class AdminMenuController extends Controller
{
    private $configPath = 'admin-menu.json'; // storage/app/admin-menu.json

    public function index()
    {
        $menu = Cache::remember('admin_menu', 60, function () {
            if (Storage::disk('local')->exists($this->configPath)) {
                return json_decode(Storage::disk('local')->get($this->configPath), true);
            }
            return [];
        });
        return response()->json($menu);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $type = $data['type'] ?? 'normal';

        $rules = match ($type) {
            'divider', 'space' => [],
            'section' => [
                'title' => 'required|string|max:255',
                'icon' => 'nullable|string|max:255',
            ],
            default => [
                'title' => 'required|string|max:255',
                'href' => 'nullable|string|max:255',
                'icon' => 'nullable|string|max:255',
            ],
        };

        $validated = validator($data, $rules)->validate();

        if ($type === 'divider') {
            $menuData = [
                'type' => 'divider',
                'id' => (string) ($data['id'] ?? Str::uuid()),
            ];
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        } elseif ($type === 'section') {
            $menuData = [
                'type' => 'section',
                'id' => (string) ($data['id'] ?? Str::uuid()),
                'title' => $validated['title'],
            ];
            if (array_key_exists('icon', $validated)) {
                $menuData['icon'] = $validated['icon'];
            }
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        } elseif ($type === 'space') {
            $menuData = [
                'type' => 'space',
                'id' => (string) ($data['id'] ?? Str::uuid()),
            ];
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        } else {
            $menuData = [
                'type' => 'normal',
                'id' => (string) ($data['id'] ?? Str::uuid()),
                'title' => $validated['title'],
                'href' => $validated['href'],
            ];
            if (array_key_exists('icon', $validated)) {
                $menuData['icon'] = $validated['icon'];
            }
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        }

        $menu = $this->getMenu();
        $menu[] = $menuData;
        $this->saveMenu($menu);
        Cache::forget('admin_menu');
        return response()->json($menuData, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $type = $data['type'] ?? 'normal';

        $rules = match ($type) {
            'divider', 'space' => [],
            'section' => [
                'title' => 'required|string|max:255',
                'icon' => 'nullable|string|max:255',
            ],
            default => [
                'title' => 'required|string|max:255',
                'href' => 'nullable|string|max:255',
                'icon' => 'nullable|string|max:255',
            ],
        };

        $validated = validator($data, $rules)->validate();

        if ($type === 'divider') {
            $menuData = [
                'type' => 'divider',
            ];
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        } elseif ($type === 'section') {
            $menuData = [
                'type' => 'section',
                'title' => $validated['title'],
            ];
            if (array_key_exists('icon', $validated)) {
                $menuData['icon'] = $validated['icon'];
            }
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        } elseif ($type === 'space') {
            $menuData = [
                'type' => 'space',
            ];
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        } else {
            $menuData = [
                'type' => 'normal',
                'title' => $validated['title'],
                'href' => $validated['href'],
            ];
            if (array_key_exists('icon', $validated)) {
                $menuData['icon'] = $validated['icon'];
            }
            if (array_key_exists('is_hidden', $data)) {
                $menuData['is_hidden'] = (bool) $data['is_hidden'];
            }
        }

        $menu = $this->getMenu();
        foreach ($menu as &$item) {
            if ($item['id'] === $id) {
                $item = array_merge($item, $menuData);
                break;
            }
        }
        $this->saveMenu($menu);
        Cache::forget('admin_menu');
        return response()->json(['success' => true, 'item' => $menuData + ['id' => $id]]);
    }

    public function destroy($id)
    {
        $menu = $this->getMenu();
        $menu = array_filter($menu, fn($item) => $item['id'] !== $id);
        $this->saveMenu(array_values($menu));
        Cache::forget('admin_menu');
        return response()->json(['success' => true]);
    }

    public function reorder(Request $request)
    {
        $order = $request->validate([
            'order' => 'required|array',
            'order.*' => 'string',
        ])['order'];
        $menu = $this->getMenu();
        $menuById = collect($menu)->keyBy('id');
        $newMenu = [];
        foreach ($order as $id) {
            if (isset($menuById[$id])) {
                $newMenu[] = $menuById[$id];
            }
        }
        $this->saveMenu($newMenu);
        Cache::forget('admin_menu');
        return response()->json(['success' => true]);
    }

    private function getMenu()
    {
        if (Storage::disk('local')->exists($this->configPath)) {
            return json_decode(Storage::disk('local')->get($this->configPath), true);
        }
        return [];
    }

    private function saveMenu($menu)
    {
        Storage::disk('local')->put($this->configPath, json_encode($menu, JSON_PRETTY_PRINT));
    }
}
