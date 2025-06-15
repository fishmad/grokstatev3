<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = \Spatie\Permission\Models\Permission::with('roles')->get();
        return Inertia::render('admin/rbac/permissions', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'description' => 'nullable|string',
        ]);
        Permission::create([
            'name' => $request->name,
            'guard_name' => 'web',
            'description' => $request->description,
        ]);
        return redirect()->route('admin.permissions.index');
    }

    public function updateDescription(Request $request, Permission $permission)
    {
        $request->validate([
            'description' => 'nullable|string',
        ]);
        $permission->description = $request->description;
        $permission->save();
        return redirect()->route('admin.permissions.index');
    }
}
