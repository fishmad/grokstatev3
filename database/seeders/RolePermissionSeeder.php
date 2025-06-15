<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Define roles
        $roles = [
            'admin', 'agent', 'seller', 'buyer', 'guest'
        ];
        // Define permissions with descriptions
        $permissions = [
            ['name' => 'manage users', 'description' => 'Allows full CRUD and management of all users, including role assignment. Used in admin user management UI and user-related API routes.'],
            ['name' => 'manage properties', 'description' => 'Allows full CRUD and management of all property listings. Used in admin property management and property API.'],
            ['name' => 'view properties', 'description' => 'Allows viewing property listings. Used in property search, details, and public property pages.'],
            ['name' => 'create listing', 'description' => 'Allows creating new property listings. Used in agent/seller listing forms.'],
            ['name' => 'edit own listing', 'description' => 'Allows editing property listings owned by the user. Used in agent/seller dashboard.'],
            ['name' => 'delete own listing', 'description' => 'Allows deleting property listings owned by the user. Used in agent/seller dashboard.'],
            ['name' => 'view contact details', 'description' => 'Allows viewing contact details of property owners/agents. Used in property details and inquiry features.'],
            ['name' => 'manage payments', 'description' => 'Allows managing all payments and transactions. Used in admin payments UI and payment API.'],
            ['name' => 'manage invoices', 'description' => 'Allows managing all invoices. Used in admin invoices UI and invoice API.'],
            ['name' => 'access admin panel', 'description' => 'Allows access to the admin dashboard and admin-only features. Used for admin route protection.'],
        ];
        // Create permissions
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(
                ['name' => $perm['name'], 'guard_name' => 'web'],
                ['description' => $perm['description']]
            );
        }
        // Create roles and assign permissions
        foreach ($roles as $role) {
            $roleModel = Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
            if ($role === 'admin') {
                $roleModel->syncPermissions(array_column($permissions, 'name'));
            } elseif ($role === 'agent') {
                $roleModel->syncPermissions(['create listing', 'edit own listing', 'delete own listing', 'view properties', 'view contact details']);
            } elseif ($role === 'seller') {
                $roleModel->syncPermissions(['create listing', 'edit own listing', 'delete own listing', 'view properties']);
            } elseif ($role === 'buyer') {
                $roleModel->syncPermissions(['view properties', 'view contact details']);
            } else {
                $roleModel->syncPermissions(['view properties']);
            }
        }
        // Assign admin role to user 1
        $admin = User::find(1);
        if ($admin) {
            $admin->assignRole('admin');
        }
    }
}
