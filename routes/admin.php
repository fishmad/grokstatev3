<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Spatie\Permission\Middleware\RoleMiddleware;

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ConstantController;
use App\Http\Controllers\Admin\PropertyClassificationController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\Users;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // RBAC routes
    Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class)
        ->only(['index', 'store'])
        ->names([
            'index' => 'roles.index',
            'store' => 'roles.store',
        ]);
    Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::post('users/assign-role', [\App\Http\Controllers\Admin\UserController::class, 'assignRole'])->name('users.assignRole');
    Route::post('roles/assign-permissions', [\App\Http\Controllers\Admin\RoleController::class, 'assignPermissions'])->name('roles.assignPermissions');
 
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/media', function () {
        return Inertia::render('admin/media/media');
    })->name('admin.media');
    Route::get('/menu-editor', function () {
        return Inertia::render('admin/menu-editor');
    })->name('admin.menu-editor');
    Route::get('/payment-gateways', function () {
        return Inertia::render('admin/payments/payment-gateways');
    })->name('admin.payment-gateways');

    Route::get('/payment-gateways/stripe', function () {
        return Inertia::render('admin/payments/payment-gateways-stripe');
    })->name('admin.payment-gateways.stripe');




    Route::get('/agents', function () {
        return Inertia::render('admin/agents/agents');
    })->name('admin.agents');
    Route::get('/listings', function () {
        return Inertia::render('admin/listings/listings');
    })->name('admin.listings');
    Route::get('/billing', function () {
        return Inertia::render('admin/billing/billing');
    })->name('admin.billing');
    Route::get('/settings', function () {
        return Inertia::render('admin/settings/settings');
    })->name('admin.settings');
    Route::get('/settings/site', function () {
        return Inertia::render('admin/settings/settings-site');
    })->name('admin.settings.site');
    Route::get('/settings/auditing', function () {
        return Inertia::render('admin/settings/settings-auditing');
    })->name('admin.settings.auditing');

    Route::get('/settings/backup', function () {
        return Inertia::render('admin/settings/settings-backup');
    })->name('admin.settings.backup');

    Route::get('/settings/log-viewer', function () {
        return Inertia::render('admin/settings/settings-log-viewer');
    })->name('admin.settings.log-viewer');
    
    Route::get('/settings/payment-config', function () {
        return Inertia::render('admin/settings/payment-config');
    })->name('admin.payment-config');
    Route::get('/settings/payments-config', function () {
        return Inertia::render('admin/settings/payments-config');
    })->name('admin.settings.payments-config');

    Route::get('/menu-editor', function () {
        return Inertia::render('admin/ui-tools/menu-editor');
    })->name('admin.menu-editor');

    Route::get('/property-classes', function () {
        return redirect('/admin/classifications/property-classifications');
    })->name('admin.property-classes.index');
    Route::get('/property-subclasses', function () {
        return redirect('/admin/classifications/property-classifications');
    })->name('admin.property-subclasses.index');



// API endpoint for frontend
Route::get('/api/constants', [ConstantController::class, 'api']); 

// Secure API route for admin to fetch the last 200 lines of the Laravel log
Route::middleware(['auth', 'role:admin|super-admin'])->prefix('api/admin')->group(function () {
    Route::get('/logs', function () {
        // Only return the last 200 lines for performance
        $logPath = storage_path('logs/laravel.log');
        if (!File::exists($logPath)) {
            return response()->json(['logs' => ['Log file not found.']], 200);
        }
        $lines = preg_split('/\r\n|\r|\n/', File::get($logPath));
        $lastLines = array_slice($lines, -200);
        return response()->json(['logs' => $lastLines], 200);
    });
    Route::post('/logs/clear', function () {
        \Artisan::call('logs:clear');
        return response()->json(['success' => true]);
    });
    // Stripe admin API endpoints
    Route::get('/stripe/config', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'getConfig']);
    Route::post('/stripe/config', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'saveConfig']);
    Route::get('/stripe/test', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'testConnection']);
    Route::get('/stripe/account-details', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'accountDetails']);
    Route::get('/stripe/webhooks', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'webhooks']);
    Route::get('/stripe/events', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'events']);
    Route::get('/stripe/products', [\App\Http\Controllers\Admin\StripeSettingsController::class, 'products']);
});


   Route::get('permissions', [\App\Http\Controllers\Admin\PermissionController::class, 'index'])->name('permissions.index');
    Route::post('permissions', [\App\Http\Controllers\Admin\PermissionController::class, 'store'])->name('permissions.store');
    Route::post('permissions/{permission}/update-description', [\App\Http\Controllers\Admin\PermissionController::class, 'updateDescription'])->name('permissions.updateDescription');

Route::middleware(['auth', RoleMiddleware::class . ':admin'])
    ->prefix('admin/constants')
    ->name('admin.constants.')
    ->group(function () {
        Route::get('/', [ConstantController::class, 'index'])->name('index');
        Route::get('/create', [ConstantController::class, 'create'])->name('create');
        Route::post('/', [ConstantController::class, 'store'])->name('store');
        Route::get('/{constant}/edit', [ConstantController::class, 'edit'])->name('edit');
        Route::put('/{constant}', [ConstantController::class, 'update'])->name('update');
        Route::delete('/{constant}', [ConstantController::class, 'destroy'])->name('destroy');
        Route::post('/refresh-cache', [ConstantController::class, 'updateCache'])->name('refresh-cache');
    });

    // Property routes
    Route::get('/properties', [PropertyController::class, 'index'])->name('admin.properties');
    Route::get('/properties/create', [PropertyController::class, 'create'])->name('admin.properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('admin.properties.store');
    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('admin.properties.edit');
    Route::put('/properties/{property}', [PropertyController::class, 'update'])->name('admin.properties.update');
    Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('admin.properties.show');

    Route::get('/property-classifications', [PropertyClassificationController::class, 'index'])->name('admin.property-classifications');
    Route::post('/property-classifications', [PropertyClassificationController::class, 'store']);
    Route::get('/property-classifications/{classification}/classes', [PropertyClassificationController::class, 'classes'])->name('admin.property-classes');
    Route::post('/property-classifications/{classification}/classes', [PropertyClassificationController::class, 'storeClass']);
    Route::get('/property-classes/{class}/subclasses', [PropertyClassificationController::class, 'subclasses'])->name('admin.property-classes.subclasses');
    Route::post('/property-classes/{class}/subclasses', [PropertyClassificationController::class, 'storeSubclass']);
    Route::get('/property-classifications/{classification}/classes/{class}/subclasses', [PropertyClassificationController::class, 'subclasses'])->name('admin.property-classifications.classes.subclasses');
    Route::post('/property-classifications/{classification}/classes/{class}/subclasses', [PropertyClassificationController::class, 'storeSubclass']);
    // http://127.0.0.1:8000/admin/property-classifications/1/classes/1/subclasses

    // Property Classes CRUD
    Route::put('/property-classifications/{classification}/classes/{class}', [PropertyClassificationController::class, 'updateClass']);
    Route::patch('/property-classifications/{classification}/classes/{class}', [PropertyClassificationController::class, 'updateClass']);
    Route::delete('/property-classifications/{classification}/classes/{class}', [PropertyClassificationController::class, 'destroyClass']);

    // Property Subclasses CRUD
    Route::put('/property-classifications/{classification}/classes/{class}/subclasses/{subclass}', [PropertyClassificationController::class, 'updateSubclass']);
    Route::patch('/property-classifications/{classification}/classes/{class}/subclasses/{subclass}', [PropertyClassificationController::class, 'updateSubclass']);
    Route::delete('/property-classifications/{classification}/classes/{class}/subclasses/{subclass}', [PropertyClassificationController::class, 'destroySubclass']);












});




// Fallback route for 404
Route::fallback(function () {
    abort(404);
});