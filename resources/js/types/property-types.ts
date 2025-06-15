import type { User } from './index'; // Import User from index.d.ts

// Basic definitions for related types - refine as needed based on actual data structure
export interface PropertyTypeRelation {
  id?: number;
  name?: string;
  slug?: string;
  // Add other relevant fields
}

export interface ListingTypeRelation {
  id?: number;
  name?: string;
  slug?: string;
  is_active?: boolean;
  // Add other relevant fields
}

export interface PropertyAddress {
  id?: number;
  unit_number?: string | null;
  street_number?: string | null;
  street_name?: string | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  // Add other relevant fields
}

// Renamed from PropertyFeature to DetailedPropertyFeatures
export interface DetailedPropertyFeatures {
  id?: number;
  propertyId?: number; // Matched to PropertyFeatureResource key
  bedrooms?: number | null;
  bathrooms?: number | null;
  carSpaces?: number | null; // Matched to PropertyFeatureResource key
  garageSpaces?: number | null; // Matched to PropertyFeatureResource key
  parkingSpaces?: number | null; // Matched to PropertyFeatureResource key
  floorArea?: number | null; // Matched to PropertyFeatureResource key
  landArea?: number | null; // Matched to PropertyFeatureResource key
  energyRating?: number | null; // Matched to PropertyFeatureResource key
  // Feature arrays (cast as array in backend)
  keywords?: string[]; // Features/keywords (array of strings)
  outdoorFeatures?: string[];
  indoorFeatures?: string[];
  climateEnergyFeatures?: string[];
  accessibilityFeatures?: string[];
  // Add other fields from PropertyFeatureResource as needed
  // createdAt?: string; // Example
  // updatedAt?: string; // Example
}

export interface PropertyMedia {
  id: number;
  model_type: string;
  model_id: number;
  uuid?: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type?: string;
  disk: string;
  conversions_disk?: string;
  size: number;
  manipulations: any[]; // Or a more specific type if known
  custom_properties: Record<string, any>; // Or a more specific type
  generated_conversions: Record<string, boolean>; // Or a more specific type
  responsive_images: any[]; // Or a more specific type
  order_column?: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url?: string;
  path: string; // Path relative to disk's root
  url: string; // Alias for original_url
  is_primary?: boolean;
  original_filename?: string | null; // Added from MediaResource
}

// Removed local User interface, it will be imported from index.d.ts

export interface Property {
  id: number;
  title: string; // Make required and non-nullable
  slug?: string | null; // Added from PropertyResource
  price?: number | string | null | import('./property-types').Price;
  price_min?: number | null; // Added from PropertyResource
  price_max?: number | null; // Added from PropertyResource
  price_mode?: string | null; // Added from PropertyResource
  status?: string | null;
  description?: string | null; // Added from PropertyResource
  headline?: string | null; // Added from PropertyResource
  image_url?: string | null; // From PropertyResource, might be derived
  listing_type_id?: number | null;
  property_type_id?: number | null;
  user_id?: number | null; // Added from PropertyResource

  property_type?: PropertyTypeRelation | null;
  listing_type?: ListingTypeRelation | null;
  address?: PropertyAddress | null;
  propertyFeature?: DetailedPropertyFeatures | null; // Updated to DetailedPropertyFeatures
  media?: PropertyMedia[] | null;
  user?: User | null; // User type is now imported

  // Timestamps from PropertyResource
  created_at?: string | null;
  updated_at?: string | null;

  // Deprecated fields (to be removed or handled if they still appear from old data)
  unit_number?: string | null;
  street_number?: string | null;
  street_name?: string | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  bedrooms?: number | null; // Keep for now if old data might have it directly
  bathrooms?: number | null; // Keep for now if old data might have it directly
  car_spaces?: number | null; // Keep for now if old data might have it directly
  garage_spaces?: number | null;
  parking_spaces?: number | null;
  // ... any other direct fields that are now nested
}

// Further Property Classification types (ensure these are defined or imported if used elsewhere)
export interface PropertySubclass {
    id: number;
    name: string;
    property_class_id: number;
}

export interface PropertyClass {
    id: number;
    name: string;
    property_classification_id: number;
    subclasses: PropertySubclass[];
}

export interface PropertyClassification {
    id: number;
    name: string;
    classes: PropertyClass[];
}

export interface PropertyClassificationSelectorValue {
    property_classification_id: number | null;
    property_class_id: number | null;
    property_subclass_id: number | null;
}

// For paginated responses from Laravel
export interface PaginatedProperties {
    current_page: number;
    data: Property[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface Price {
  id: number;
  property_id: number;
  price_type: string;
  amount?: number | null;
  range_min?: number | null;
  range_max?: number | null;
  label?: string | null;
  hide_amount?: boolean;
  penalize_search?: boolean;
  display?: boolean;
  tax?: string;
  display_price?: string; // Laravel accessor
}
