# GitHub Copilot Standing Order: Laravel 12.x React Project

This document defines the coding standards, naming conventions, and architectural guidelines for code generation by GitHub Copilot in this Laravel 12.x project, built with the Laravel React Starter Kit (https://github.com/laravel/react-starter-kit). Copilot **MUST** adhere to these rules to ensure consistency, maintainability, and alignment with the project's tech stack and conventions. Place this file in the `/.github` folder to guide Copilot in Visual Studio Code.

**Project Details**  
- **Date**: June 4, 2025  
- **Backend**: Laravel 12.x (https://laravel.com/docs/12.x)  
- **Frontend**: React 19 with Inertia.js (SEO-friendly SPA)  
- **CSS**: Tailwind CSS v4.1 (https://tailwindcss.com) with Vite Plugin  
- **Icons**: Lucide Icons (https://lucide.dev/icons)  
- **UI Components**: ShadCN/UI (https://ui.shadcn.com/docs)  
- **Authentication**: Laravel Built-in Authentication, Laravel Sanctum (https://laravel.com/docs/12.x/sanctum)  
- **Authorization**: Spatie Laravel Permission (https://spatie.be/docs/laravel-permission/v6/installation-laravel)  
- **Starter Kit**: Laravel React Starter Kit (R2R implementation)

---

## 1. General PHP & Laravel Coding Standards

Copilot MUST follow Laravel 12.x coding style (https://laravel.com/docs/12.x/contributions#coding-style) and PSR standards for all PHP code.

- **PSR Compliance**: Adhere to PSR-1 (Basic Coding Standard), PSR-4 (Autoloading), and PSR-12 (Extended Coding Style).
- **Indentation**: Use **4 spaces** for indentation. **No tabs**.
- **Line Length**: Soft limit of **120 characters**, aim for **80 characters** where possible.
- **Brace Placement**:
  - **Classes and Methods**: Opening brace `{` on the **next line**.
    ```php
    class Example {
        public function method() {
            // Code
        }
    }
    ```
  - **Control Structures** (`if`, `for`, `while`, closures): Opening brace `{` on the same line.
    ```php
    if ($condition) {
        // Code
    }
    ```
- **Visibility**: Always declare `public`, `protected`, or `private` for properties and methods.
- **Fat Models, Skinny Controllers**:
  - **Controllers**: Keep lean, handling HTTP requests, calling services/models, and returning Inertia responses. Avoid business logic.
  - **Models**: Encapsulate database logic, relationships, and data manipulation.
  - **Services**: Use service classes (`app/Services/`) for complex business logic.
- **DRY Principle**: Promote code reuse via helper functions, Blade Components, Eloquent scopes, and reusable classes.
- **Eloquent ORM**:
  - Prefer Eloquent for database interactions.
  - Define relationships (`hasMany`, `belongsTo`, etc.).
  - Use eager loading (`->with()`) to prevent N+1 issues.
  - Create Eloquent scopes for reusable queries.
    ```php
    // app/Models/Property.php
    public function scopeActive($query) {
        return $query->whereHas('listingStatus', fn($q) => $q->where('is_historical', false));
    }
    ```
- **Validation**: Use form request classes (`php artisan make:request`).
  ```php
  // app/Http/Requests/StorePropertyRequest.php
  public function rules() {
      return [
          'title' => 'required|string|max:255',
          'beds' => 'required|integer|min:0',
      ];
  }
  ```
- **Error Handling**: Use try-catch blocks and custom exceptions where needed.
  ```php
  try {
      // Code
  } catch (\Exception $e) {
      return Inertia::render('error/error-page', ['message' => $e->getMessage()]);
  }
  ```
- **Configuration**: Use `config()` helper, not `env()` outside `config/` files.
- **Modularity**: Ensure clear separation of concerns and encapsulation.

---

## 2. Naming Conventions

Copilot MUST use the following naming conventions for PHP, Laravel, and TypeScript files, adhering to Laravel 12.x standards and your updated TypeScript file/folder structure.

### PHP & Laravel
- **Methods/Functions**: `camelCase`
  ```php
  public function getPropertyDetails() {
      // Code
  }
  ```
- **Variables**: `camelCase`
  ```php
  $propertyCount = 10;
  ```
- **Models**:
  - **Naming**: Singular, `StudlyCaps` (e.g., `Property`, `Address`, `Feature`).
  - **File Path**: `app/Models/{ModelName}.php` (e.g., `app/Models/Property.php`).
- **Controllers**:
  - **Naming**: Singular, `StudlyCaps` with `Controller` suffix (e.g., `PropertyController`).
  - **File Path**: `app/Http/Controllers/{ControllerName}.php` (e.g., `app/Http/Controllers/PropertyController.php`).
- **Form Requests**:
  - **Naming**: Descriptive, `StudlyCaps` with `Request` suffix (e.g., `StorePropertyRequest`, `UpdateAgentRequest`).
  - **File Path**: `app/Http/Requests/{RequestName}.php`.
- **Resources (API)**:
  - **Naming**: Singular, `StudlyCaps` with `Resource` suffix (e.g., `PropertyResource`).
  - **File Path**: `app/Http/Resources/{ResourceName}.php`.
- **Services**:
  - **Naming**: Singular, `StudlyCaps` with `Service` suffix (e.g., `PropertyService`).
  - **File Path**: `app/Services/{ServiceName}.php` (create `app/Services/` if needed).
- **Migrations**:
  - **Naming**: Descriptive, `snake_case`, timestamp-prefixed (e.g., `2025_06_04_000000_create_properties_table`).
  - **File Path**: `database/migrations/{Timestamp}_{Name}.php`.
- **Database Tables**:
  - **Naming**: Plural, `snake_case` (e.g., `properties`, `addresses`, `features`).
  - **Pivot Tables**: Singular model names, alphabetical order, `snake_case` (e.g., `feature_property`).
- **Table Columns**:
  - **Naming**: `snake_case` (e.g., `street_address`, `is_active`).
  - **Foreign Keys**: Singular model name with `_id` suffix (e.g., `property_id`, `user_id`).
- **Routes**:
  - **URL Segments**: Plural, `kebab-case` (e.g., `/properties`, `/agents/1/properties`).
  - **Named Routes**: `snake_case` with dot notation, prefixed with the resource name (e.g., `properties.index`, `agents.list`).
    ```php
    Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
    Route::get('/agents', [AgentController::class, 'index'])->name('agents.list');
    ```

### TypeScript/JavaScript/React

- **File Names**: `kebab-case` for all TypeScript/JavaScript files (e.g., `property-card.tsx`, `properties-index.tsx`).

- **Folder Structure**:

  - For every resource/controller, create a dedicated subfolder under `resources/ts/pages/` (or `resources/js/pages/`), named after the resource in plural kebab-case (e.g., `properties`, `categories`, `features`).
  - Place all views/pages related to that resource/controller inside its subfolder.
    - Example (public user area):
      - `resources/ts/pages/properties/properties-index.tsx`
      - `resources/ts/pages/properties/properties-create.tsx`
      - `resources/ts/pages/properties/properties-show.tsx`
      - `resources/ts/pages/properties/properties-edit.tsx`
  - For the admin area, create a separate `admin/` subfolder for admin-specific pages:
    - Example (admin area):
      - `resources/ts/pages/admin/properties/properties-index.tsx`
      - `resources/ts/pages/admin/properties/properties-create.tsx`
      - `resources/ts/pages/admin/properties/properties-show.tsx`
      - `resources/ts/pages/admin/properties/properties-edit.tsx`
  - Extract and place shared UI or logic in `resources/ts/components/` (e.g., `property-form.tsx`, `property-card.tsx`) and import them in both public and admin pages as needed.
  - This structure prevents clutter in the `pages` directory, ensures scalability, and keeps public/admin logic and UI separate.
  - For shared or generic pages, use a `common/` or `shared/` subfolder as needed.

- **Component Naming**:
  - Filenames: `kebab-case` (e.g., `property-card.tsx`)
  - Component names: `kebab-case` (e.g., `property-card`)

- **View Examples**:

  ```tsx
  // resources/ts/pages/properties/properties-index.tsx
  export default function propertiesIndex() {
      return <div>Property List</div>;
  }

  // resources/ts/pages/agents/agents-create.tsx
  export default function agentsCreate() {
      return <div>Create Agent</div>;
  }
  ```

- **Variables/Functions**: `camelCase`.

  ```tsx
  const propertyCount = 10;
  function fetchProperties() {
      // Code
  }
  ```

---

## 3. Technology-Specific Guidelines

Copilot MUST generate code that leverages the project’s tech stack and adheres to best practices.

### Laravel Authentication
- Use Laravel’s built-in authentication (provided by the React Starter Kit).
- Generate controllers in `app/Http/Controllers/Auth/` for login, registration, and logout.
  ```php
  // app/Http/Controllers/Auth/RegisteredUserController.php
  public function store(StoreUserRequest $request) {
      $user = User::create($request->validated());
      Auth::login($user);
      return Inertia::render('dashboard/dashboard');
  }
  ```

### Laravel Sanctum
- Use Sanctum for API authentication (configured in the Starter Kit).
- Generate API routes in `routes/api.php` with Sanctum middleware.
  ```php
  Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
      return $request->user();
  });
  ```

### Spatie Laravel Permission
- Use `spatie/laravel-permission` for roles and permissions.
- Generate code with `can()`, `hasRole()`, `assignRole()`, `givePermissionTo()`.
  ```php
  // app/Http/Controllers/PropertyController.php
  public function update(StorePropertyRequest $request, Property $property) {
      $this->authorize('update', $property);
      $property->update($request->validated());
      return Inertia::render('properties/properties_show', ['property' => $property]);
  }
  ```
- Include role/permission migrations if needed.
  ```php
  // database/migrations/2025_06_04_000000_create_permission_tables.php
  Schema::create('roles', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->timestamps();
  });
  ```

### Inertia.js
- Return `Inertia::render()` from controllers with props for React components, using the updated view paths.
- **Note**: The project uses `@inertiajs/react` (version 1.0.0 or higher), which bundles the core Inertia.js functionality. The standalone `@inertiajs/inertia` package is **not** required and should not be installed or imported.
- Prioritize the `useForm` hook from `@inertiajs/react` for all form submissions, including those with file uploads. It handles form state, validation errors, and `FormData` creation automatically.
  ```php
  // app/Http/Controllers/PropertyController.php
  public function store(StorePropertyRequest $request) {
      $property = Property::create($request->validated() + ['expires_at' => now()->addMonths(6)]);
      return Inertia::render('properties/properties_show', ['property' => $property]);
  }
  ```

### Tailwind CSS v4.1
- Use Tailwind utility classes exclusively for styling.
- Avoid custom CSS unless required for non-utility styling (place in `resources/css/`).
  ```tsx
  // resources/ts/components/property-card.ts
  <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{property.title}</h2>
  </div>
  ```

### Lucide Icons
- Use Lucide Icons for visual elements in React components.
  ```tsx
  // resources/ts/components/property-card.ts
  import { Home } from 'lucide-react';
  <Home className="w-6 h-6 text-blue-500" />;
  ```

### ShadCN/UI Components
- Prioritize ShadCN/UI components (e.g., Button, Input, Table) for UI.
  ```tsx
  // resources/ts/pages/properties/properties_create.tsx
  import { Button } from '@/components/ui/button';
  <Button type="submit">Create Property</Button>;
  ```

---

## 4. Project-Specific Conventions

Copilot MUST align with the Laravel React Starter Kit and your database schema requirements.

### Models
- Generate models in `app/Models/` with singular `StudlyCaps` names:
  - `Property` (`app/Models/Property.php`)
  - `Address` (`app/Models/Address.php`)
  - `Feature` (`app/Models/Feature.php`)
  - `Media` (`app/Models/Media.php`)
  - `Agent` (`app/Models/Agent.php`, if distinct from `User`)
- Define relationships, casts, and scopes.
  ```php
  // app/Models/Property.php
  class Property extends Model {
      protected $casts = [
          'dynamic_attributes' => 'array',
          'is_free' => 'boolean',
          'expires_at' => 'datetime',
      ];
      public function address() {
          return $this->hasOne(Address::class);
      }
      public function features() {
          return $this->belongsToMany(Feature::class, 'feature_property');
      }
  }
  ```

### Controllers
- Generate controllers in `app/Http/Controllers/` with `Controller` suffix.
- Use Inertia responses with updated view paths and form requests.
  ```php
  // app/Http/Controllers/PropertyController.php
  public function store(StorePropertyRequest $request) {
      $property = Property::create($request->validated() + ['expires_at' => now()->addMonths(6)]);
      return Inertia::render('properties/properties_show', ['property' => $property]);
  }
  ```

### Resources
- Generate API resources in `app/Http/Resources/` for Sanctum API endpoints.
  ```php
  // app/Http/Resources/PropertyResource.php
  class PropertyResource extends JsonResource {
      public function toArray($request) {
          return [
              'id' => $this->id,
              'title' => $this->title,
              'slug' => $this->slug,
          ];
      }
  }
  ```

### TypeScript Files
- Use `kebab-case` for filenames in `resources/ts/`.
- **Components**: Place in `resources/ts/components/` (e.g., `property-card.ts`, `agent-profile.ts`).
- **Pages**: Place in `resources/ts/pages/{resource}/` (plural, `kebab-case`), with filenames prepended with the resource name.
  - Example: `resources/ts/pages/properties/properties_index.tsx`, `properties_create.tsx`, `properties_show.tsx`, `properties_edit.tsx`.
  - Alternative for index: `properties_list.tsx` if specified.
  ```tsx
  // resources/ts/pages/properties/properties_index.tsx
  import { Property } from '@/types';
  type Props = { properties: { data: Property[] } };
  export default function PropertiesIndex({ properties }: Props) {
      return <div className="p-4">{properties.data.map(p => <div>{p.title}</div>)}</div>;
  }
  ```

### Database Schema
- Follow the schema from artifact ID `81057555-134d-4995-aa91-b47ce3ec3ccd`:
  - Tables: `properties`, `addresses`, `features`, `media`, `users`, `property_types`, `listing_methods`, `listing_statuses`, etc.
  - Pivot Tables: `feature_property`, `property_category`, `property_agent`.
  - Columns: `snake_case` (e.g., `dynamic_attributes`, `listing_status_id`).
- Generate migrations with `php artisan make:migration` and `snake_case` names.
  ```php
  // database/migrations/2025_06_04_000000_create_properties_table.php
  Schema::create('properties', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('property_type_id')->constrained()->onDelete('cascade');
      $table->string('title');
      $table->json('dynamic_attributes')->nullable();
      $table->timestamps();
  });
  ```

---

## 5. Best Practices for Copilot

- **Consistency**: Match the Laravel React Starter Kit’s structure and conventions.
- **Comments**: Include PHPDoc blocks for classes, methods, and complex logic.
  ```php
  /**
   * Store a new property.
   *
   * @param StorePropertyRequest $request
   * @return \Inertia\Response
   */
  public function store(StorePropertyRequest $request) {
      // Code
  }
  ```
- **Type Safety**: Use TypeScript types/interfaces in React components.
  ```tsx
  // resources/ts/types/index.ts
  export interface Property {
      id: number;
      title: string;
      slug: string;
  }
  ```
- **Security**: Sanitize inputs, use Laravel’s validation, and apply Sanctum/Spatie middleware.
- **Performance**: Optimize queries with eager loading and indexing.
  ```php
  Property::with('address', 'features')->where('listing_status_id', 1)->get();
  ```
- **File Organization**: Follow Laravel’s structure and your `resources/ts/pages/{resource}/` convention.
- **Prompt Specificity**: Respond to prompts like:
  ```
  /* Copilot: Generate a Laravel controller for Property with Inertia responses, using StorePropertyRequest, rendering resources/ts/pages/properties/properties_index.tsx */
  ```

---

## 6. Example Workflow

When generating code, Copilot should:

1. **Identify Context**: Check the file path (e.g., `app/Http/Controllers/`, `resources/ts/pages/properties/`) and apply conventions.
2. **Apply Naming**: Use `StudlyCaps` for PHP classes, `kebab-case` for TypeScript files, `snake_case` for database columns.
3. **Leverage Tech Stack**: Use Laravel Sanctum, Spatie Permissions, Inertia.js, Tailwind CSS, ShadCN/UI, and Lucide Icons.
4. **Generate Code**: Produce PSR-12 compliant PHP and type-safe TypeScript, with Inertia responses.
5. **Validate**: Align with the schema (artifact ID `81057555-134d-4995-aa91-b47ce3ec3ccd`) and Starter Kit.

### Example Copilot Prompt
```
// In VS Code, create app/Http/Controllers/PropertyController.php
/* Copilot: Generate a Laravel resource controller for Property with Inertia responses. Implement index (paginate with address, features), store (use StorePropertyRequest, set expires_at to now + 6 months), show (use slug). Apply Spatie permissions with can('view properties'). Return resources/ts/pages/properties/properties_index.tsx, resources/ts/pages/properties/properties_show.tsx */
```

---

## 7. File Placement

Place this standing order in `/.github/COPILOT_STANDING_ORDER.md`.

```bash
# Create the file
mkdir -p .github
touch .github/COPILOT_STANDING_ORDER.md
```

---

## Conclusion

This standing order ensures GitHub Copilot generates consistent, maintainable code for your Laravel 12.x / React 19 project. It incorporates your updated TypeScript structure (`resources/ts/pages/properties/properties_index.tsx`), Laravel’s coding style, and your tech stack (Sanctum, Spatie, Inertia, Tailwind, ShadCN/UI, Lucide). Use the provided prompts in VS Code to expedite development with the Laravel React Starter Kit.

Refer to `.github/BUILD_ORDER.md` for the full roadmap and Copilot prompts.
Refer to `.github/STATUS.md` for the full roadmap status.

- Whenever a new view/page is created and a corresponding route is added or updated in `routes/web.php` or `routes/api.php`, a menu item must be added to the main sidebar navigation (in `app-sidebar.tsx` or the relevant sidebar component) to provide direct UI access to the new resource or view. This should be done as part of the same build step.
- The menu item should use a clear, human-readable title and the correct route path. Use the appropriate icon for the resource or view, following the existing icon usage pattern.
- This requirement applies to all admin and public navigation sidebars. If a new sidebar is introduced, update this standing order accordingly.

- All new page views (including resource CRUD pages) must use the dashboard layout pattern as shown in `dashboard.tsx`:
  - Use the `AppLayout` component for consistent layout and theming.
  - Include a `breadcrumbs` array and pass it to `AppLayout` for navigation context.
  - Use the `Head` component from Inertia for page titles.
  - Structure the main content with Tailwind utility classes for spacing, cards, and responsive grids as in the dashboard example.
- When creating new resource views (e.g., for properties, categories, features), ensure the design and structure are consistent with the dashboard template, including breadcrumbs and layout.
- Update existing resource views to use this pattern for a unified user experience.