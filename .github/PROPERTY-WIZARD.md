# Property Creation Wizard: Draft → Media → Preview → Publish

## Objective

Implement a robust, user-friendly, and industry-standard multi-step property creation flow for the property listing platform. The flow separates property details entry, media upload, preview, and publishing, ensuring reliability, draft safety, and extensibility. This approach matches best practices seen on leading platforms (realestate.com.au, Zillow, Airbnb).

---

## Why This Flow?

- **Reliability:** Media uploads are handled separately from the main form, avoiding React’s file input quirks and large payload issues.
- **Draft Safety:** Users can save progress, return later, or recover from errors without losing data.
- **Clear User Journey:** The flow matches what users expect from major platforms (realestate.com.au, Zillow, Airbnb, etc).
- **Extensible:** You can add moderation, admin approval, or multi-step onboarding easily.

---

## Recommended Step Order

1. **Address**
2. **Category**
3. **Details, Structure & Price** (all property details in one step)
4. **Features**
5. **Media Upload**
6. **Preview**
7. **Publish/Submit**

> **Note:**  
> - Steps can be merged further if some are rarely used or have few fields.  
> - Always let users preview before final submission.  
> - Consider a progress bar or step indicator for clarity.

---

## Step-by-Step Flow

### 0. Database Preparation (REQUIRED)

Before implementing the wizard, ensure your database supports draft/incomplete status for properties.

**Steps:**

- **Add a `status` column to the `properties` table** (if not present):
  - Type: `string`
  - Default: `'draft'`
  - Purpose: Tracks property state (`draft`, `active`, `incomplete`, etc.)

**Files to Update:**

- `database/migrations/2025_06_04_120015_create_properties_table.php`  
  - Add a `status` column with default `'draft'`.
- If migration already exists, create a new migration to add the column:
  - `php artisan make:migration add_status_to_properties_table --table=properties`
- `app/Models/Property.php`  
  - Add `status` to `$fillable` and `$casts` as needed.

**Example Migration:**

```php
// database/migrations/xxxx_xx_xx_xxxxxx_add_status_to_properties_table.php
public function up()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->string('status')->default('draft')->after('slug');
    });
}
```

---

### 1. Address (Step 1)

- User enters property address/location.

---

### 2. Category (Step 2)

- User selects property category (market/use).

---

### 3. Details, Structure & Price (Step 3)

- User enters all property details: beds, baths, size, price, etc.

---

### 4. Features (Step 4)

- User selects property features (can be merged with previous step if simple).

---

### 5. Media Upload (Step 5)

- User uploads images, videos, or documents.
- Media is POSTed to `/properties/{id}/media` and linked to the property.

---

### 6. Preview (Step 6)

- User reviews the full listing (details + media).

---

### 7. Publish/Submit (Step 7)

- User clicks “Publish” to make the listing live.
- Backend validates required fields and at least one media item.
- Property status is updated to `active`/`live`.

---

## Files to Update

- `database/migrations/2025_06_04_120015_create_properties_table.php` (add `status` column)
- `app/Models/Property.php` (add `status` to `$fillable` and `$casts`)
- `resources/js/pages/properties/properties-create-wizard.tsx` (refactor steps and POST logic)
- `resources/js/pages/properties/properties-create-media.tsx` (media upload step)
- `app/Http/Controllers/PropertyController.php` (draft logic, status update)
- `app/Http/Controllers/MediaController.php` (media upload)
- `resources/js/components/property/form/PropertyPreviewMediaStep.tsx` (preview step)
- `resources/js/components/property/form/PropertySubmitStep.tsx` (publish step)
- `routes/web.php` (media upload route)
- `resources/js/pages/properties/properties-show.tsx` (preview rendering)

---

## Additional UX/Technical Recommendations

- **Progress Bar:** Show step progress (e.g., “Step 2 of 7: Features”).
- **Save as Draft:** Allow users to exit and return later.
- **Auto-save:** Optionally save after each step (use localStorage or backend).
- **Error Handling:** Display clear errors for missing required fields or failed uploads.
- **Extensibility:** Easy to add moderation, admin approval, or onboarding steps.

---

## Summary Table

| Step         | User Action         | Backend Action                | Key Files/Components                                      |
|--------------|--------------------|-------------------------------|-----------------------------------------------------------|
| 0. DB Prep   | Add status column   | Migration, model update       | `properties_table.php`, `Property.php`                    |
| 1. Address   | Enter address       | -                             | `properties-create-wizard.tsx`                            |
| 2. Category  | Select category     | -                             | `properties-create-wizard.tsx`                            |
| 3. Details   | Enter details/price | Create draft, return ID       | `properties-create-wizard.tsx`, `PropertyController.php`  |
| 4. Features  | Select features     | -                             | `properties-create-wizard.tsx`                            |
| 5. Media     | Upload files        | Store media, link to property | `properties-create-media.tsx`, `MediaController.php`      |
| 6. Preview   | Review listing      | (none)                        | `PropertyPreviewMediaStep.tsx`, `properties-show.tsx`     |
| 7. Publish   | Go live             | Validate, set status active   | `PropertySubmitStep.tsx`, `PropertyController.php`        |

---

## Progress Tracking

- Mark each step as complete in this file as you implement and verify.
- Update [STATUS.md](STATUS.md) and [BUILD_ORDER.md](BUILD_ORDER.md) as you progress.

---

## Next Steps

- [x] Add/confirm `status` column in properties table and update model.
- [x] Refactor wizard to use the new step order and POST logic.
- [x] Implement/confirm backend draft logic and ID return.
- [x] Integrate media upload step using property ID.
- [x] Add preview and publish steps.
- [x] Add progress bar, draft save, and error handling as needed.
- [x] Update documentation and mark steps complete as you go.

---
