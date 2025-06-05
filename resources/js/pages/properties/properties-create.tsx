import React, { useState, useEffect } from 'react'; // Keep useEffect if used elsewhere
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AddressAutofill from '@/components/address-autofill';
import { Button } from '@/components/ui/button';
import PricesInput from '@/components/prices-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Properties', href: '/properties' },
  { title: 'Create', href: '/properties/create' },
];

// Add at the top, after imports
interface AddressForm {
  street_number?: string;
  street_name?: string;
  unit_number?: string;
  lot_number?: string;
  site_name?: string;
  region_name?: string;
  lat?: string;
  long?: string;
  display_address_on_map?: boolean;
  display_street_view?: boolean;
}

interface PropertyFormData {
  [key: string]: any;
  title: string;
  description: string;
  property_type_id: string;
  listing_method_id: string;
  listing_status_id: string;
  categories: string[];
  features: string[];
  address: AddressForm;
  beds: string;
  baths: string;
  parking_spaces: string;
  ensuites: string;
  garage_spaces: string;
  land_size: string;
  land_size_unit: string;
  building_size: string;
  building_size_unit: string;
  dynamic_attributes: Record<string, string>;
  prices: any[];
  slug: string;
  media: File[];
}

export default function PropertiesCreate({ propertyTypes, listingMethods, listingStatuses, categoryGroups, featureGroups }: any) {
  const { data, setData, post, processing, errors, progress } = useForm<PropertyFormData>({
    title: '',
    description: '',
    property_type_id: '',
    listing_method_id: '',
    listing_status_id: '',
    categories: [],
    features: [],
    address: {
      street_number: '',
      street_name: '',
      unit_number: '',
      lot_number: '',
      site_name: '',
      region_name: '',
      lat: '',
      long: '',
      display_address_on_map: true,
      display_street_view: true,
    },
    beds: '',
    baths: '',
    parking_spaces: '',
    ensuites: '',
    garage_spaces: '',
    land_size: '',
    land_size_unit: '',
    building_size: '',
    building_size_unit: '',
    dynamic_attributes: {},
    prices: [],
    slug: '',
    media: [],
  });

  // Dynamic Attributes state for key-value pairs
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update data.dynamic_attributes whenever attributes changes
  useEffect(() => {
    setData('dynamic_attributes', attributes.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>));
  }, [attributes, setData]); // Add setData to dependency array

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous success
    // The 'post' method from useForm will handle FormData creation internally
    // if 'data.media' contains files.
    post('/properties', {
      // Optional: Add callbacks for success, error, finish
      onSuccess: () => {
        setSuccessMessage('Property created successfully!');
        // Optionally reset form fields here
        // reset();
      },
      onError: (pageErrors) => {
        // Errors are already available in the 'errors' object from useForm
        setSuccessMessage(null);
        console.error('Form submission error:', pageErrors);
      },
      // preserveScroll: true, // Optional: to prevent scrolling to top on validation errors
    });
  };

  // Two-step category selection state
  // Use the first group in categoryGroups for top-level categories
  const mainCategoryGroup = categoryGroups[0];
  const topLevelCategories = mainCategoryGroup ? mainCategoryGroup.categories : [];
  const [selectedTopLevelCategory, setSelectedTopLevelCategory] = useState<string | null>(null);
  const selectedCategoryObj = topLevelCategories.find((cat: any) => cat.id === selectedTopLevelCategory);
  const childCategories = selectedCategoryObj?.children || [];

  // Auto-select property type when a subcategory is chosen and matches a property type
  const lastAutoSetType = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Only auto-select if exactly one subcategory is selected
    if (data.categories.length === 1 && propertyTypes && propertyTypes.length > 0) {
      let selectedCat = null;
      for (const top of topLevelCategories) {
        if (top.children) {
          const found = top.children.find((c: any) => c.id === data.categories[0]);
          if (found) selectedCat = found;
        }
      }
      if (selectedCat) {
        // Try to match category name to property type name (case-insensitive)
        const match = propertyTypes.find((pt: any) => pt.name.toLowerCase() === selectedCat.name.toLowerCase());
        if (match) {
          const matchId = String(match.id);
          if (data.property_type_id !== matchId && lastAutoSetType.current !== matchId) {
            setData('property_type_id', matchId);
            lastAutoSetType.current = matchId;
          }
          return;
        }
      }
    }
    // If not exactly one subcategory, or no match, clear property_type_id if it was auto-set
    if (lastAutoSetType.current && data.property_type_id === lastAutoSetType.current) {
      setData('property_type_id', '');
      lastAutoSetType.current = null;
    }
    // eslint-disable-next-line
  }, [data.categories, propertyTypes, topLevelCategories]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Property" />
      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Property</h1>
          <Button asChild>
            <a href="/properties" className="ml-auto">Back to List</a>
          </Button>
        </div>
        <form className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-8 border border-zinc-200 dark:border-zinc-800" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
              {successMessage}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
                <Input id="title" name="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                <Textarea id="description" name="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Description" rows={4} />
              </div>
              {/* Property Type (with help text) */}
              <div className="space-y-2">
                <label htmlFor="property_type_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Property Type <span className="text-xs text-zinc-500">(structure)</span>
                </label>
                <Select value={data.property_type_id} onValueChange={val => setData('property_type_id', val)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((pt: any) => (
                      <SelectItem key={pt.id} value={String(pt.id)}>{pt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select the physical or structural type of the property (e.g., House, Apartment, Land). This is a single, required choice.
                </p>
              </div>
              {/* Listing Method */}
              <div className="space-y-2">
                <label htmlFor="listing_method_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Listing Method</label>
                <Select value={data.listing_method_id} onValueChange={val => setData('listing_method_id', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Listing Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingMethods.map((lm: any) => (
                      <SelectItem key={lm.id} value={String(lm.id)}>{lm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Listing Status */}
              <div className="space-y-2">
                <label htmlFor="listing_status_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Listing Status</label>
                <Select value={data.listing_status_id} onValueChange={val => setData('listing_status_id', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Listing Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingStatuses.map((ls: any) => (
                      <SelectItem key={ls.id} value={String(ls.id)}>{ls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Numeric Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="beds" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Beds</label>
                  <Input id="beds" type="number" min="0" name="beds" value={data.beds || ''} onChange={e => setData('beds', e.target.value)} placeholder="Beds" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="baths" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Baths</label>
                  <Input id="baths" type="number" min="0" name="baths" value={data.baths || ''} onChange={e => setData('baths', e.target.value)} placeholder="Baths" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="parking_spaces" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Parking Spaces</label>
                  <Input id="parking_spaces" type="number" min="0" name="parking_spaces" value={data.parking_spaces || ''} onChange={e => setData('parking_spaces', e.target.value)} placeholder="Parking Spaces" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="ensuites" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Ensuites</label>
                  <Input id="ensuites" type="number" min="0" name="ensuites" value={data.ensuites || ''} onChange={e => setData('ensuites', e.target.value)} placeholder="Ensuites" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="garage_spaces" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Garage Spaces</label>
                  <Input id="garage_spaces" type="number" min="0" name="garage_spaces" value={data.garage_spaces || ''} onChange={e => setData('garage_spaces', e.target.value)} placeholder="Garage Spaces" />
                </div>
              </div>
              {/* Land/Building Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="land_size" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Land Size</label>
                  <div className="flex gap-2">
                    <Input id="land_size" type="number" min="0" name="land_size" value={data.land_size || ''} onChange={e => setData('land_size', e.target.value)} placeholder="Land Size" />
                    <Select value={data.land_size_unit || ''} onValueChange={val => setData('land_size_unit', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="acre">acre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="building_size" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Building Size</label>
                  <div className="flex gap-2">
                    <Input id="building_size" type="number" min="0" name="building_size" value={data.building_size || ''} onChange={e => setData('building_size', e.target.value)} placeholder="Building Size" />
                    <Select value={data.building_size_unit || ''} onValueChange={val => setData('building_size_unit', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="sqft">sqft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Categories & Features */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                <div className="space-y-4">
                  {/* Step 1: Top-level category selection */}
                  <div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Step 1: Select a top-level category</div>
                    <div className="flex flex-wrap gap-4">
                      {topLevelCategories.map((cat: any) => (
                        <label key={cat.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="topLevelCategory"
                            value={cat.id}
                            checked={selectedTopLevelCategory === cat.id}
                            onChange={() => {
                              setSelectedTopLevelCategory(cat.id);
                              setData('categories', []); // Reset child selection
                            }}
                            className="accent-blue-600 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Step 2: Child category selection */}
                  {selectedTopLevelCategory && childCategories.length > 0 && (
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1 mt-4">Step 2: Select subcategories</div>
                      <div className="flex flex-wrap gap-4">
                        {childCategories.map((child: any) => (
                          <label key={child.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="childCategory"
                              value={child.id}
                              checked={data.categories.includes(child.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setData('categories', [...data.categories, child.id]);
                                } else {
                                  setData('categories', data.categories.filter((id: string) => id !== child.id));
                                }
                              }}
                              className="accent-blue-600 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
                            />
                            {child.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* If no children, allow selecting just the top-level */}
                  {selectedTopLevelCategory && childCategories.length === 0 && (
                    <div className="mt-2">
                      <label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <input
                          type="radio"
                          name="categoryFinal"
                          value={selectedTopLevelCategory}
                          checked={data.categories[0] === selectedTopLevelCategory}
                          onChange={() => setData('categories', [selectedTopLevelCategory])}
                          className="accent-blue-600 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
                        />
                        <span>Use {selectedCategoryObj?.name}</span>
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select the market, use, or feature categories for this property. Categories are hierarchical and can be used for browsing, marketing, or filtering.
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Features</label>
                <div className="space-y-4">
                  {featureGroups.map((group: any) => (
                    <div key={group.id}>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{group.name}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.features.map((f: any) => (
                          <label key={f.id} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <input
                              type="checkbox"
                              value={f.id}
                              checked={data.features.includes(f.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setData('features', [...data.features, f.id]);
                                } else {
                                  setData('features', data.features.filter((id: string) => id !== f.id));
                                }
                              }}
                              className="accent-blue-600 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
                            />
                            <span>{f.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Street Number"
                    value={data.address?.street_number || ''}
                    onChange={e => setData('address', { ...data.address, street_number: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Street Name"
                    value={data.address?.street_name || ''}
                    onChange={e => setData('address', { ...data.address, street_name: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Unit Number (optional)"
                    value={data.address?.unit_number || ''}
                    onChange={e => setData('address', { ...data.address, unit_number: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Lot Number (optional)"
                    value={data.address?.lot_number || ''}
                    onChange={e => setData('address', { ...data.address, lot_number: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Site Name (optional)"
                    value={data.address?.site_name || ''}
                    onChange={e => setData('address', { ...data.address, site_name: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Region Name (optional)"
                    value={data.address?.region_name || ''}
                    onChange={e => setData('address', { ...data.address, region_name: e.target.value })}
                  />
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder="Latitude (optional)"
                    value={data.address?.lat || ''}
                    onChange={e => setData('address', { ...data.address, lat: e.target.value })}
                  />
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder="Longitude (optional)"
                    value={data.address?.long || ''}
                    onChange={e => setData('address', { ...data.address, long: e.target.value })}
                  />
                  {/* TODO: Add suburb select and state/country if needed */}
                </div>
                {/* Optionally, add checkboxes for display_address_on_map and display_street_view */}
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.address?.display_address_on_map ?? true}
                      onChange={e => setData('address', { ...data.address, display_address_on_map: e.target.checked })}
                    />
                    <span>Display address on map</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.address?.display_street_view ?? true}
                      onChange={e => setData('address', { ...data.address, display_street_view: e.target.checked })}
                    />
                    <span>Display street view</span>
                  </label>
                </div>
              </div>
              {/* Dynamic Attributes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dynamic Attributes (JSON)</label>
                <div className="space-y-2">
                  {attributes.map((attr, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder="Attribute Name"
                        value={attr.key}
                        onChange={e => {
                          const newAttrs = [...attributes];
                          newAttrs[idx].key = e.target.value;
                          setAttributes(newAttrs);
                        }}
                        className="w-1/2"
                      />
                      <Input
                        type="text"
                        placeholder="Value"
                        value={attr.value}
                        onChange={e => {
                          const newAttrs = [...attributes];
                          newAttrs[idx].value = e.target.value;
                          setAttributes(newAttrs);
                        }}
                        className="w-1/2"
                      />
                      <Button type="button" variant="ghost" onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setAttributes([...attributes, { key: '', value: '' }])}>Add Attribute</Button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Add custom key-value pairs for this property. These will be stored as JSON.</p>
              </div>
              {/* Prices (repeatable) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Prices</label>
                <PricesInput prices={data.prices || []} setPrices={(prices: any) => setData('prices', prices)} />
              </div>
              {/* Media Upload */}
              <div className="space-y-2">
                <label htmlFor="media" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Media Upload</label>
                <Input
                  id="media"
                  type="file"
                  name="media"
                  multiple
                  className="input input-bordered w-full"
                  onChange={e => setData('media', e.target.files ? Array.from(e.target.files) : [])} // Convert FileList to File[]
                />
                {/* Display progress if available (for file uploads) */}
                {progress && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                  </div>
                )}
                {/* Display media validation errors if any */}
                {errors.media && <p className="text-xs text-red-500 mt-1">{errors.media}</p>}
              </div>
              {/* Slug */}
              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug (optional)</label>
                <Input
                  id="slug"
                  name="slug"
                  value={data.slug || ''}
                  onChange={e => setData('slug', e.target.value)}
                  placeholder="property-title-or-custom-slug"
                  autoComplete="off"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Leave blank to auto-generate from title.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={processing} size="lg">Create Property</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
