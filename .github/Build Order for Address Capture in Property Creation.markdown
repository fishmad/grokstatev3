# Build Order for Address Capture in Property Creation

This document outlines the step-by-step process to implement user input capture for Country, State, and Suburb, address handling with Google Places API, and frontend-backend logic for creating a property in a Laravel 12.x application. The solution is part of the `grokstatev3` property listing website, using React 19, Inertia.js, Tailwind CSS v4.1, and ShadCN/UI. It ensures the `address` table’s `suburb_id` (linked to `suburbs`, `states`, and `countries`) is populated correctly, supporting both autofill and manual input.

**Date**: June 5, 2025  
**Tech Stack**: Laravel 12.x, React 19, Inertia.js, Tailwind CSS v4.1, ShadCN/UI, MySQL, Google Places API, Sanctum  
**Tools**: Visual Studio Code, GitHub Copilot, Terminal, Composer, npm  
**Project Directory**: `grokstatev3`

---

## Overview

The goal is to capture Country, State, and Suburb when a user creates a property via a form, resolving these inputs to a `suburb_id` in the `addresses` table. The schema includes:

- **countries**: `id`, `name`, `iso_code`, `timestamps`
- **states**: `id`, `country_id`, `name`, `iso_code`, `timestamps`
- **suburbs**: `id`, `state_id`, `name`, `postcode`, `timestamps`
- **addresses**: `id`, `property_id`, `suburb_id` (nullable), `street_number`, `street_name`, `unit_number` (nullable), `lot_number` (nullable), `site_name` (nullable), `region_name` (nullable), `lat` (nullable), `long` (nullable), `display_address_on_map`, `display_street_view`, `timestamps`
- **properties**: `id`, `title`, `slug`, `property_type_id`, `description`, `expires_at`, `user_id`, `beds`, `baths`, `parking_spaces`, `ensuites`, `garage_spaces`, `land_size`, `land_size_unit`, `building_size`, `building_size_unit`, `dynamic_attributes`, `is_free`, `timestamps`, etc.

**Requirements**:
- Frontend form with Google Places API autofill and manual dropdowns for Country, State, Suburb.
- Backend logic to resolve inputs to `suburb_id`.
- API routes for dynamic dropdown options.
- Validation and Eloquent relationships.
- Compliance with naming conventions: `snake_case` routes/tables, `StudlyCaps` models, `kebab-case` TypeScript paths.

---

## Step 1: Configure Google Places API

Ensure Google Places API is set up for address autofill.

### Terminal Commands
```bash
# Verify .env configuration
echo "GOOGLE_PLACES_API_KEY=your-google-places-api-key" >> grokstatev3/.env
```

### Update Frontend
Include Google Places API script in `resources/views/app.blade.php`.

### Files Modified
- `grokstatev3/.env`
- `grokstatev3/resources/views/app.blade.php`

### Copilot Prompt
```
// In VS Code, open resources/views/app.blade.php
/* Copilot: Add Google Places API script to the head section, using the GOOGLE_PLACES_API_KEY from .env */
```

### Explanation for AI
- Add `<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_PLACES_API_KEY') }}&libraries=places"></script>` to `<head>`.
- Ensure the key is loaded from `.env` to enable `address-autofill.tsx`.

---

## Step 2: Create Frontend Form

Implement the property creation form with address autofill and cascading dropdowns.

### Files Modified
- `grokstatev3/resources/ts/pages/properties/properties-create.tsx`
- `grokstatev3/resources/ts/components/address-autofill.tsx`

### Copilot Prompts
```
// In VS Code, create resources/ts/pages/properties/properties-create.tsx
/* Copilot: Generate a React form using ShadCN/UI components (Input, Select, Button) with TypeScript. Include fields for title, description, property_type_id (select), street_number, street_name, unit_number, lot_number, site_name, region_name, country_id (select), state_id (select), suburb_id (select), land_size, land_size_unit, building_size, building_size_unit, beds, baths, parking_spaces, ensuites, garage_spaces, dynamic_attributes, slug, prices, media. Use AddressAutofill component for Google Places API. Fetch states and suburbs dynamically via /api/states/{country} and /api/suburbs/{state}. Submit to /properties via Inertia.post */
```

```
// In VS Code, create resources/ts/components/address-autofill.tsx
/* Copilot: Generate a React component with TypeScript for Google Places API autofill. Use an Input component from ShadCN/UI with id="address-input". Extract street_number, street_name, unit_number, lot_number, site_name, region_name, suburb, postcode, state, country, lat, long from the selected place. Call onSelect callback with these values. Fetch matching country_id, state_id, suburb_id via /api/resolve-location */
```

### Explanation for AI
- **properties-create.tsx**:
  - Initialize state for form fields (`title`, `property_type_id`, `street_number`, `country_id`, etc.).
  - Use `useEffect` to fetch `states` when `country_id` changes, and `suburbs` when `state_id` changes.
  - Render `AddressAutofill` to populate address fields.
  - Use `Select` for cascading dropdowns, disabling `state_id` until `country_id` is selected, and `suburb_id` until `state_id` is selected.
  - Submit via `Inertia.post` to `/properties`.
- **address-autofill.tsx**:
  - Use `useRef` for the input element and Google Places Autocomplete instance.
  - Initialize Autocomplete with `fields: ['address_components', 'geometry']` and `types: ['address']`.
  - Parse `address_components` to extract `street_number`, `street_name`, `unit_number`, `lot_number`, `site_name`, `region_name`, `suburb`, `postcode`, `state`, `country`.
  - Extract `lat` and `long` from `geometry.location`.
  - Call `/api/resolve-location` to get `country_id`, `state_id`, `suburb_id` for dropdowns.
  - Clean up event listeners on unmount.

---

## Step 3: Define Eloquent Models

Set up Eloquent models with relationships to support address capture.

### Terminal Commands
```bash
# Generate models
php artisan make:model Country -m
php artisan make:model State -m
php artisan make:model Suburb -m
php artisan make:model Address -m
php artisan make:model Property -m
```

### Files Modified
- `grokstatev3/app/Models/Country.php`
- `grokstatev3/app/Models/State.php`
- `grokstatev3/app/Models/Suburb.php`
- `grokstatev3/app/Models/Address.php`
- `grokstatev3/app/Models/Property.php`

### Copilot Prompts
```
// In VS Code, open app/Models/Country.php
/* Copilot: Generate an Eloquent model for Country with fillable name, iso_code. Define hasMany relationship to States */
```

```
// In VS Code, open app/Models/State.php
/* Copilot: Generate an Eloquent model for State with fillable name, country_id, iso_code. Define belongsTo relationship to Country, hasMany to Suburbs */
```

```
// In VS Code, open app/Models/Suburb.php
/* Copilot: Generate an Eloquent model for Suburb with fillable name, postcode, state_id. Define belongsTo relationship to State, hasMany to Addresses */
```

```
// In VS Code, open app/Models/Address.php
/* Copilot: Generate an Eloquent model for Address with fillable property_id, suburb_id, street_number, street_name, unit_number, lot_number, site_name, region_name, lat, long, display_address_on_map, display_street_view. Define belongsTo relationships to Property and Suburb */
```

```
// In VS Code, open app/Models/Property.php
/* Copilot: Generate an Eloquent model for Property with fillable title, description, property_type_id, listing_method_id, listing_status_id, beds, baths, parking_spaces, ensuites, garage_spaces, land_size, land_size_unit, building_size, building_size_unit, dynamic_attributes, slug, expires_at, user_id. Define hasOne relationship to Address, belongsTo to PropertyType and User */
```

### Explanation for AI
- Ensure `fillable` properties allow mass assignment for `firstOrCreate`.
- Define relationships:
  - `Country hasMany States`
  - `State belongsTo Country`, `hasMany Suburbs`
  - `Suburb belongsTo State`, `hasMany Addresses`
  - `Address belongsTo Property`, `belongsTo Suburb`
  - `Property hasOne Address`
- Use `StudlyCaps` for model names, per Standing Order.

---

## Step 4: Implement Backend Logic

Create the controller and request validation to process form submissions.

### Terminal Commands
```bash
# Generate controller and request
php artisan make:controller PropertyController --resource
php artisan make:request StorePropertyRequest
```

### Files Modified
- `grokstatev3/app/Http/Controllers/PropertyController.php`
- `grokstatev3/app/Http/Requests/StorePropertyRequest.php`

### Copilot Prompts
```
// In VS Code, open app/Http/Controllers/PropertyController.php
/* Copilot: Generate a Laravel resource controller with create and store methods. For create, return Inertia response rendering properties-create.tsx with propertyTypes and countries. For store, use StorePropertyRequest. Resolve country_id, state_id, suburb_id using validated input. Create Property with title, description, property_type_id, listing_method_id, listing_status_id, beds, baths, parking_spaces, ensuites, garage_spaces, land_size, land_size_unit, building_size, building_size_unit, dynamic_attributes, slug (from title), expires_at (now + 6 months), user_id (auth). Create Address with suburb_id, street_number, street_name, unit_number, lot_number, site_name, region_name, lat, long, display_address_on_map, display_street_view. Redirect to properties.show */
```

```
// In VS Code, open app/Http/Requests/StorePropertyRequest.php
/* Copilot: Generate a Laravel form request with authorize returning auth()->check(). Define rules: title (required, string, max:255), description (required, string), property_type_id (required, exists:property_types,id), listing_method_id (required, exists:listing_methods,id), listing_status_id (required, exists:listing_statuses,id), street_number (nullable, string, max:50), street_name (required, string, max:255), unit_number (nullable, string, max:50), lot_number (nullable, string, max:50), site_name (nullable, string, max:255), region_name (nullable, string, max:255), country_id (required, exists:countries,id), state_id (required, exists:states,id), suburb_id (required, exists:suburbs,id), postcode (required, string, max:20), lat (nullable, numeric), long (nullable, numeric), display_address_on_map (nullable, boolean), display_street_view (nullable, boolean), beds (nullable, integer, min:0), baths (nullable, integer, min:0), parking_spaces (nullable, integer, min:0), ensuites (nullable, integer, min:0), garage_spaces (nullable, integer, min:0), land_size (nullable, numeric, min:0), land_size_unit (nullable, string, max:10), building_size (nullable, numeric, min:0), building_size_unit (nullable, string, max:10), dynamic_attributes (nullable, array), slug (nullable, string, max:255), prices (nullable, array), media (nullable, array) */
```

### Explanation for AI
- **PropertyController**:
  - `create`: Fetch `PropertyType`, `ListingMethod`, `ListingStatus`, and `Country` records for form dropdowns.
  - `store`:
    - Use validated input for all fields, including new flexible size/unit fields.
    - Create `Property` with all relevant fields, generate `slug` using `Str::slug`, set `expires_at` to 6 months from now, assign `user_id` from `auth()->id()`.
    - Create `Address` with resolved `suburb_id` and all address fields.
    - Redirect to `properties.show` with the property’s `id`.
- **StorePropertyRequest**:
  - Authorize authenticated users.
  - Validate all fields, including new flexible size/unit fields.

---

## Step 5: Set Up API Routes

Create API routes to support dynamic dropdowns and location resolution.

### Files Modified
- `grokstatev3/routes/api.php`

### Copilot Prompt
```
// In VS Code, open routes/api.php
/* Copilot: Add Sanctum-authenticated API routes: GET /states/{country} to return country’s states (id, name), GET /suburbs/{state} to return state’s suburbs (id, name, postcode), GET /resolve-location to resolve country, state, suburb, postcode query params to country_id, state_id, suburb_id using firstOrCreate */
```

### Explanation for AI
- Use `Route::middleware('auth:sanctum')` to secure routes.
- `/states/{country}`: Return `states` for a `Country` instance.
- `/suburbs/{state}`: Return `suburbs` for a `State` instance.
- `/resolve-location`: Accept query params (`country`, `state`, `suburb`, `postcode`), use `firstOrCreate` to resolve IDs, return JSON with `country_id`, `state_id`, `suburb_id`.
- Use `snake_case` route names, per Standing Order.

---

## Step 6: Update Routes

Define web routes for property creation.

### Files Modified
- `grokstatev3/routes/web.php`

### Copilot Prompt
```
// In VS Code, open routes/web.php
/* Copilot: Add resource routes for properties using PropertyController, with middleware auth, and explicit names (properties.create, properties.store, properties.show). Use snake_case naming */
```

### Explanation for AI
- Add `Route::resource('properties', PropertyController::class)->middleware('auth')->names([...])`.
- Specify names: `properties.create`, `properties.store`, `properties.show`.
- Ensure `auth` middleware restricts access to authenticated users.

---

## Step 7: Optimize Database

Add unique constraints to prevent duplicate locations.

### Terminal Commands
```bash
# Generate migration
php artisan make:migration add_unique_constraints_to_location_tables
```

### Files Modified
- `grokstatev3/database/migrations/2025_06_05_000000_add_unique_constraints_to_location_tables.php`

### Copilot Prompt
```
// In VS Code, open the new migration
/* Copilot: Generate a Laravel migration to add unique constraints: countries.name, states(name, country_id), suburbs(name, postcode, state_id) */
```

### Explanation for AI
- Use `Schema::table` to add:
  - `unique('name')` to `countries`.
  - `unique(['name', 'country_id'])` to `states`.
  - `unique(['name', 'postcode', 'state_id'])` to `suburbs`.
- Run `php artisan migrate` to apply.

---

## Step 8: Seed Initial Data

Seed `countries` to improve performance.

### Terminal Commands
```bash
# Generate seeder
php artisan make:seeder CountrySeeder
```

### Files Modified
- `grokstatev3/database/seeders/CountrySeeder.php`

### Copilot Prompt
```
// In VS Code, open database/seeders/CountrySeeder.php
/* Copilot: Generate a Laravel seeder to insert countries: Australia (iso_code: AU), United States (iso_code: US) */
```

### Run Seeder
```bash
php artisan db:seed --class=CountrySeeder
```

### Explanation for AI
- Insert at least two countries to populate the `countries` dropdown.
- Use `Country::insert([...])` for efficiency.
- Set `iso_code` for future internationalization.

---

## Step 9: Test Implementation

Write tests to verify address capture.

### Terminal Commands
```bash
# Generate test
php artisan make:test PropertyCreationTest --unit
```

### Files Modified
- `grokstatev3/tests/Feature/PropertyCreationTest.php`

### Copilot Prompt
```
// In VS Code, open tests/Feature/PropertyCreationTest.php
/* Copilot: Generate a PHPUnit test for PropertyController@store. Test: authenticated user submits valid form with title, description, property_type_id, listing_method_id, listing_status_id, street_number, street_name, unit_number, lot_number, site_name, region_name, country_id, state_id, suburb_id, postcode, lat, long, beds, baths, parking_spaces, ensuites, garage_spaces, land_size, land_size_unit, building_size, building_size_unit, dynamic_attributes, slug, prices, media. Assert Property and Address are created, Address has correct suburb_id, Property has expires_at (6 months from now) */
```

### Run Tests
```bash
php artisan test
```

### Explanation for AI
- Use `actingAs` to authenticate a user.
- Post to `/properties` with valid data.
- Assert `properties` and `addresses` tables have new records.
- Verify `suburb_id` links to correct `suburb`, `state`, and `country`.
- Check `expires_at` is set correctly.

---

## Files to Touch

- **Configuration**:
  - `grokstatev3/.env` (Google Places API key)
- **Frontend**:
  - `grokstatev3/resources/views/app.blade.php` (Google Places script)
  - `grokstatev3/resources/ts/pages/properties/properties-create.tsx` (Form)
  - `grokstatev3/resources/ts/components/address-autofill.tsx` (Autofill)
- **Backend**:
  - `grokstatev3/app/Models/Country.php`
  - `grokstatev3/app/Models/State.php`
  - `grokstatev3/app/Models/Suburb.php`
  - `grokstatev3/app/Models/Address.php`
  - `grokstatev3/app/Models/Property.php`
  - `grokstatev3/app/Http/Controllers/PropertyController.php`
  - `grokstatev3/app/Http/Requests/StorePropertyRequest.php`
  - `grokstatev3/app/Http/Requests/UpdatePropertyRequest.php`
  - `grokstatev3/routes/web.php` (Web routes)
  - `grokstatev3/routes/api.php` (API routes)
- **Database**:
  - `grokstatev3/database/migrations/2025_06_05_000000_add_unique_constraints_to_location_tables.php`
  - `grokstatev3/database/migrations/2025_06_05_000001_add_property_details_columns_to_properties_table.php`
  - `grokstatev3/database/seeders/CountrySeeder.php`
- **Tests**:
  - `grokstatev3/tests/Feature/PropertyCreationTest.php`

---

## Conclusion

This build order provides a complete roadmap for capturing Country, State, and Suburb during property creation in `grokstatev3`. It uses Google Places API for autofill, cascading dropdowns for manual input, and backend logic to resolve inputs to `suburb_id`. The solution leverages Laravel 12.x’s Eloquent relationships, Inertia.js for frontend-backend communication, and ShadCN/UI for styling. Run the terminal commands, apply Copilot prompts, and modify the listed files to implement the feature. The implementation ensures compliance with `snake_case` routes, `StudlyCaps` models, `kebab-case` TypeScript paths, and your existing schema.