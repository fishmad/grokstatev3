import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AddressAutofill from '@/components/address-autofill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

interface AddressForm {
  street_number?: string;
  street_name?: string;
  unit_number?: string;
  lot_number?: string;
  region_name?: string;
  latitude?: string | number;
  longitude?: string | number;
  display_address_on_map?: boolean;
  display_street_view?: boolean;
  suburb?: string;
  state?: string;
  country?: string;
  postcode?: string;
  country_id?: number | string;
  state_id?: number | string;
  suburb_id?: number | string;
}

interface PriceForm {
  price_type: string;
  amount?: string;
  range_min?: string;
  range_max?: string;
  label?: string;
  hide_amount: boolean;
  penalize_search: boolean;
  display: boolean;
  tax: string;
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
  price?: PriceForm;
  slug: string;
  country_id?: number | string;
  state_id?: number | string;
  suburb_id?: number | string;
  postcode?: string;
}

interface Country { id: number; name: string; }
interface State { id: number; name: string; }
interface Suburb { id: number; name: string; postcode: string; }
interface Category { id: string | number; name: string; children?: Category[]; }
interface Feature { id: string | number; name: string; }
interface FeatureGroup { id: string | number; name: string; features: Feature[]; }
interface CategoryGroup { id: string | number; name: string; categories: Category[]; }

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Properties', href: '/properties' },
  { title: 'Edit', href: '#' },
];

const defaultPriceForm: PriceForm = {
  price_type: 'sale',
  amount: '',
  range_min: '',
  range_max: '',
  label: '',
  hide_amount: false,
  penalize_search: false,
  display: true,
  tax: 'unknown',
};

type PropertiesEditProps = {
  property: any;
  propertyTypes: any[];
  listingMethods: any[];
  listingStatuses: any[];
  categoryGroups: CategoryGroup[];
  featureGroups: FeatureGroup[];
  countries: Country[];
  states: State[];
  suburbs: Suburb[];
};

export default function PropertiesEdit({ property, propertyTypes, listingMethods, listingStatuses, categoryGroups, featureGroups, countries: initialCountries, states: initialStates, suburbs: initialSuburbs }: PropertiesEditProps) {
  const { data, setData, put, processing, errors } = useForm<PropertyFormData>({
    title: property.title || '',
    description: property.description || '',
    property_type_id: property.property_type_id ? String(property.property_type_id) : '',
    listing_method_id: property.listing_method_id ? String(property.listing_method_id) : '',
    listing_status_id: property.listing_status_id ? String(property.listing_status_id) : '',
    categories: property.categories?.map((c: any) => String(c.id)) || [],
    features: property.features?.map((f: any) => String(f.id)) || [],
    address: property.address || {},
    beds: property.beds || '',
    baths: property.baths || '',
    parking_spaces: property.parking_spaces || '',
    ensuites: property.ensuites || '',
    garage_spaces: property.garage_spaces || '',
    land_size: property.land_size || '',
    land_size_unit: property.land_size_unit || '',
    building_size: property.building_size || '',
    building_size_unit: property.building_size_unit || '',
    dynamic_attributes: property.dynamic_attributes ? (typeof property.dynamic_attributes === 'string' ? JSON.parse(property.dynamic_attributes) : property.dynamic_attributes) : {},
    price: property.price ? (typeof property.price === 'string' ? JSON.parse(property.price) : property.price) : undefined,
    slug: property.slug || '',
    country_id: property.address?.country_id || '',
    state_id: property.address?.state_id || '',
    suburb_id: property.address?.suburb_id || '',
    postcode: property.address?.postcode || '',
  });

  // Dynamic Attributes state for key-value pairs
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(
    Object.entries(data.dynamic_attributes || {}).map(([key, value]) => ({ key, value: String(value) }))
  );
  const [showPriceForm, setShowPriceForm] = useState<boolean>(!!data.price);
  const [countries, setCountries] = useState<Country[]>(initialCountries || []);
  const [states, setStates] = useState<State[]>(initialStates || []);
  const [suburbs, setSuburbs] = useState<Suburb[]>(initialSuburbs || []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setData('dynamic_attributes', attributes.reduce((acc: Record<string, string>, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {}));
  }, [attributes]);

  useEffect(() => {
    if (!initialCountries?.length) {
      fetch('/api/countries')
        .then(res => res.json())
        .then(setCountries)
        .catch(() => setCountries([]));
    }
  }, [initialCountries]);

  // Set initial dropdowns to match the current property address
  useEffect(() => {
    if (data.country_id) {
      fetch(`/api/states/${data.country_id}`)
        .then(res => res.json())
        .then(states => {
          setStates(states);
          // Only set state if it exists in the list
          if (data.state_id && !states.find((s: State) => String(s.id) === String(data.state_id))) {
            setData('state_id', '');
          }
        });
    }
  }, []); // Only run on mount

  useEffect(() => {
    if (data.state_id) {
      fetch(`/api/suburbs/${data.state_id}`)
        .then(res => res.json())
        .then(suburbs => {
          setSuburbs(suburbs);
          // Only set suburb if it exists in the list
          if (data.suburb_id && !suburbs.find((su: Suburb) => String(su.id) === String(data.suburb_id))) {
            setData('suburb_id', '');
          }
        });
    }
  }, []); // Only run on mount

  useEffect(() => {
    if (data.country_id) {
      fetch(`/api/states/${data.country_id}`)
        .then(res => res.json())
        .then(setStates)
        .catch(() => setStates([]));
      setData('state_id', '');
      setData('suburb_id', '');
    } else {
      setStates([]);
    }
  }, [data.country_id, setData]);

  useEffect(() => {
    if (data.state_id) {
      fetch(`/api/suburbs/${data.state_id}`)
        .then(res => res.json())
        .then(setSuburbs)
        .catch(() => setSuburbs([]));
      setData('suburb_id', '');
    } else {
      setSuburbs([]);
    }
  }, [data.state_id, setData]);

  useEffect(() => {
    if (data.price) {
      const { price_type, amount, hide_amount } = data.price;
      const penalize = !amount || hide_amount || ['enquire', 'contact', 'call', 'tba'].includes(price_type);
      if (data.price.penalize_search !== penalize) {
        setData('price', { ...data.price, penalize_search: penalize });
      }
    }
  }, [data.price?.price_type, data.price?.amount, data.price?.hide_amount, data.price, setData]);

  // AddressAutofill helpers
  const addressFormToAddress = (address: AddressForm): any => ({
    street_number: address.street_number,
    street_name: address.street_name,
    suburb: address.suburb,
    postcode: address.postcode,
    state: address.state,
    country: address.country,
    latitude: address.latitude !== undefined && address.latitude !== '' ? Number(address.latitude) : undefined,
    longitude: address.longitude !== undefined && address.longitude !== '' ? Number(address.longitude) : undefined,
  });
  const addressToAddressForm = (address: any): AddressForm => ({
    street_number: address.street_number || '',
    street_name: address.street_name || '',
    suburb: address.suburb || '',
    postcode: address.postcode || '',
    state: address.state || '',
    country: address.country || '',
    latitude: address.latitude !== undefined ? String(address.latitude) : '',
    longitude: address.longitude !== undefined ? String(address.longitude) : '',
  });
  const handleAddressChange = (address: any) => {
    // Only update address fields, do not overwrite IDs
    const mapped = addressToAddressForm(address);
    setData('address', { ...data.address, ...mapped });
    // Always keep the current IDs unless resolve-location returns new ones
    if (mapped.suburb || mapped.state || mapped.country || mapped.postcode) {
      fetch('/resolve-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: mapped.country,
          state: mapped.state,
          suburb: mapped.suburb,
          postcode: mapped.postcode,
        }),
      })
        .then(res => res.json())
        .then((locData: any) => {
          // Only update IDs if resolve-location returns them
          if (locData.suburb_id) setData('suburb_id', locData.suburb_id);
          if (locData.state_id) setData('state_id', locData.state_id);
          if (locData.country_id) setData('country_id', locData.country_id);
        })
        .catch(console.error);
    }
  };

  // Category selection logic (mirrors Create)
  const mainCategoryGroup = Array.isArray(categoryGroups) && categoryGroups.length > 0 ? categoryGroups[0] : undefined;
  const topLevelCategories = mainCategoryGroup && Array.isArray(mainCategoryGroup.categories) ? mainCategoryGroup.categories : [];
  const [selectedTopLevelCategory, setSelectedTopLevelCategory] = useState<string | number | null>(() => {
    if (Array.isArray(data.categories) && data.categories.length > 0 && topLevelCategories.length > 0) {
      for (const top of topLevelCategories) {
        if (top.children && top.children.some((c: Category) => data.categories.includes(String(c.id)))) {
          return top.id;
        }
        if (data.categories.includes(String(top.id))) {
          return top.id;
        }
      }
    }
    return null;
  });
  const selectedCategoryObj = topLevelCategories.find((cat: Category) => cat.id === selectedTopLevelCategory);
  const childCategories = selectedCategoryObj?.children || [];
  const lastAutoSetType = useRef<string | null>(null);
  useEffect(() => {
    if (data.categories.length === 1 && propertyTypes && propertyTypes.length > 0) {
      let selectedCat: Category | null = null;
      for (const top of topLevelCategories) {
        if (top.children) {
          const found = top.children.find((c: Category) => c.id === data.categories[0]);
          if (found) selectedCat = found;
        }
      }
      if (selectedCat) {
        const match = propertyTypes.find((pt: any) => pt.name.toLowerCase() === selectedCat!.name.toLowerCase());
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
    if (lastAutoSetType.current && data.property_type_id === lastAutoSetType.current) {
      setData('property_type_id', '');
      lastAutoSetType.current = null;
    }
  }, [data.categories, propertyTypes, data.property_type_id, setData, topLevelCategories]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    const submission: Record<string, any> = { ...data };
    // Ensure location fields are nested under address
    if (!submission.address) submission.address = {};
    (['country_id', 'state_id', 'suburb_id', 'postcode'] as const).forEach((field) => {
      if (submission[field]) {
        submission.address[field] = submission[field];
        delete submission[field];
      }
    });
    // Set postcode from selected suburb if available
    const selectedSuburb = suburbs.find((su: Suburb) => String(su.id) === String(submission.address.suburb_id));
    if (selectedSuburb?.postcode) submission.address.postcode = selectedSuburb.postcode;
    // Send price as JSON string if defined
    if (submission.price) {
      submission.price = JSON.stringify(submission.price);
    }
    // Send dynamic_attributes as JSON string
    submission.dynamic_attributes = JSON.stringify(submission.dynamic_attributes ?? {});
    put(`/properties/${property.id}`, {
      onError: (err: any) => {
        setSuccessMessage(null);
        console.error('Form submission error:', err);
      },
      onSuccess: () => setSuccessMessage('Property updated successfully!'),
    });
  };

  // Helper for nested error fields
  const getError = (field: string) => {
    if (errors[field]) return errors[field];
    // For nested fields like price.amount
    const [parent, child] = field.split('.');
    if (errors[parent] && typeof errors[parent] === 'object' && errors[parent][child]) {
      return errors[parent][child];
    }
    return undefined;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Property" />
      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Property</h1>
          <Button asChild>
            <a href="/properties" className="ml-auto">Back to List</a>
          </Button>
        </div>
        <form className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-8 border border-zinc-200 dark:border-zinc-800" onSubmit={handleSubmit}>
          {(successMessage) && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
              {successMessage}
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
              <div className="font-semibold mb-1">Please fix the following errors:</div>
              <ul className="list-disc pl-5">
                {Object.entries(errors).map(([field, msg]) => (
                  <li key={field}>{String(msg)}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-2">
                <label id="property_type_id-label" htmlFor="property_type_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Property Type <span className="text-xs text-zinc-500">(structure)</span>
                </label>
                <Select value={data.property_type_id} onValueChange={val => setData('property_type_id', val)}>
                  <SelectTrigger aria-labelledby="property_type_id-label">
                    <SelectValue placeholder="Select Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(propertyTypes) ? propertyTypes : []).map((pt: any) => (
                      <SelectItem key={pt.id} value={String(pt.id)}>{pt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('property_type_id') && <p className="text-xs text-red-500 mt-1">{getError('property_type_id')}</p>}
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select the physical or structural type of the property (e.g., House, Apartment, Land). This is a single, required choice.
                </p>
              </div>
              
              <div className="space-y-2">
                <label id="listing_method_id-label" htmlFor="listing_method_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Listing Method</label>
                <Select value={data.listing_method_id} onValueChange={val => setData('listing_method_id', val)}>
                  <SelectTrigger aria-labelledby="listing_method_id-label">
                    <SelectValue placeholder="Select Listing Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(listingMethods) ? listingMethods : []).map((lm: any) => (
                      <SelectItem key={lm.id} value={String(lm.id)}>{lm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('listing_method_id') && <p className="text-xs text-red-500 mt-1">{getError('listing_method_id')}</p>}
              </div>

              <div className="space-y-2">
                <label id="listing_status_id-label" htmlFor="listing_status_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Listing Status</label>
                <Select value={data.listing_status_id} onValueChange={val => setData('listing_status_id', val)}>
                  <SelectTrigger aria-labelledby="listing_status_id-label">
                    <SelectValue placeholder="Select Listing Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(listingStatuses) ? listingStatuses : []).map((ls: any) => (
                      <SelectItem key={ls.id} value={String(ls.id)}>{ls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('listing_status_id') && <p className="text-xs text-red-500 mt-1">{getError('listing_status_id')}</p>}
              </div>



              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Step 1: Select a top-level category</div>
                    <div className="flex flex-wrap gap-4">
                      {topLevelCategories.map((cat: Category) => (
                        <label key={cat.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="topLevelCategory"
                            value={cat.id}
                            checked={selectedTopLevelCategory === cat.id}
                            onChange={() => {
                              setSelectedTopLevelCategory(cat.id);
                              setData('categories', []);
                            }}
                            className="accent-blue-600 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  {selectedTopLevelCategory && childCategories.length > 0 && (
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1 mt-4">Step 2: Select subcategories</div>
                      <div className="flex flex-wrap gap-4">
                        {childCategories.map((child: Category) => (
                          <label key={child.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="childCategory"
                              value={child.id}
                              checked={data.categories.includes(String(child.id))}
                              onChange={e => {
                                if (e.target.checked) {
                                  setData('categories', [...data.categories, String(child.id)]);
                                } else {
                                  setData('categories', data.categories.filter((id: string) => id !== String(child.id)));
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
                  {selectedTopLevelCategory && childCategories.length === 0 && (
                    <div className="mt-2">
                      <label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <input
                          type="radio"
                          name="categoryFinal"
                          value={selectedTopLevelCategory}
                          checked={data.categories[0] === selectedTopLevelCategory}
                          onChange={() => setData('categories', [String(selectedTopLevelCategory)])}
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
                {getError('categories') && <p className="text-xs text-red-500 mt-1">{getError('categories')}</p>}
              </div>




            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
                <Input id="title" name="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" />
                {getError('title') && <p className="text-xs text-red-500 mt-1">{getError('title')}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                <Textarea id="description" name="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Description" rows={4} />
                {getError('description') && <p className="text-xs text-red-500 mt-1">{getError('description')}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="land_size" className="block text-xs font-medium text-bold">Land Size</label>
                  <div className="flex gap-2">
                    <Input id="land_size" type="number" min="0" name="land_size" value={data.land_size || ''} onChange={e => setData('land_size', e.target.value)} placeholder="Land Size" />
                    <Select value={data.land_size_unit || ''} onValueChange={val => setData('land_size_unit', val)}>
                      <SelectTrigger id="land_size_unit">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="acre">acre</SelectItem>
                        <SelectItem value="ha">ha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {getError('land_size') && <p className="text-xs text-red-500 mt-1">{getError('land_size')}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="building_size" className="block text-xs font-medium text-bold">Building Size</label>
                  <div className="flex gap-2">
                    <Input id="building_size" type="number" min="0" name="building_size" value={data.building_size || ''} onChange={e => setData('building_size', e.target.value)} placeholder="Building Size" />
                    <Select value={data.building_size_unit || ''} onValueChange={val => setData('building_size_unit', val)}>
                      <SelectTrigger id="building_size_unit">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="sqft">sqft</SelectItem>
                        <SelectItem value="ha">ha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {getError('building_size') && <p className="text-xs text-red-500 mt-1">{getError('building_size')}</p>}
                </div>
              </div>



              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="beds" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Beds</label>
                  <Input id="beds" type="number" min="0" name="beds" value={data.beds || ''} onChange={e => setData('beds', e.target.value)} placeholder="Beds" />
                  {getError('beds') && <p className="text-xs text-red-500 mt-1">{getError('beds')}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="baths" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Baths</label>
                  <Input id="baths" type="number" min="0" name="baths" value={data.baths || ''} onChange={e => setData('baths', e.target.value)} placeholder="Baths" />
                  {getError('baths') && <p className="text-xs text-red-500 mt-1">{getError('baths')}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="parking_spaces" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Parking Spaces</label>
                  <Input id="parking_spaces" type="number" min="0" name="parking_spaces" value={data.parking_spaces || ''} onChange={e => setData('parking_spaces', e.target.value)} placeholder="Parking Spaces" />
                  {getError('parking_spaces') && <p className="text-xs text-red-500 mt-1">{getError('parking_spaces')}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="ensuites" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Ensuites</label>
                  <Input id="ensuites" type="number" min="0" name="ensuites" value={data.ensuites || ''} onChange={e => setData('ensuites', e.target.value)} placeholder="Ensuites" />
                  {getError('ensuites') && <p className="text-xs text-red-500 mt-1">{getError('ensuites')}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="garage_spaces" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Garage Spaces</label>
                  <Input id="garage_spaces" type="number" min="0" name="garage_spaces" value={data.garage_spaces || ''} onChange={e => setData('garage_spaces', e.target.value)} placeholder="Garage Spaces" />
                  {getError('garage_spaces') && <p className="text-xs text-red-500 mt-1">{getError('garage_spaces')}</p>}
                </div>
              </div>

            </div>


            <div className="space-y-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Features</label>
                <div className="space-y-4">
                  {(Array.isArray(featureGroups) ? featureGroups : []).map((group: FeatureGroup) => (
                    <div key={group.id}>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{group.name}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {(Array.isArray(group.features) ? group.features : []).map((f: Feature) => (
                          <label key={f.id} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <input
                              type="checkbox"
                              value={f.id}
                              checked={Array.isArray(data.features) && data.features.includes(String(f.id))}
                              onChange={e => {
                                if (e.target.checked) {
                                  setData('features', [...(Array.isArray(data.features) ? data.features : []), String(f.id)]);
                                } else {
                                  setData('features', (Array.isArray(data.features) ? data.features : []).filter((id: string) => id !== String(f.id)));
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
                {getError('features') && <p className="text-xs text-red-500 mt-1">{getError('features')}</p>}
              </div>





              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Country</label>
                <Select
                  value={data.country_id ? String(data.country_id) : ''}
                  onValueChange={val => setData('country_id', val ? Number(val) : '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c: Country) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('country_id') && <p className="text-xs text-red-500 mt-1">{getError('country_id')}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">State</label>
                <Select
                  value={data.state_id ? String(data.state_id) : ''}
                  onValueChange={val => setData('state_id', val ? Number(val) : '')}
                  disabled={!data.country_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s: State) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('state_id') && <p className="text-xs text-red-500 mt-1">{getError('state_id')}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Suburb</label>
                <Select
                  value={data.suburb_id ? String(data.suburb_id) : ''}
                  onValueChange={val => setData('suburb_id', val ? Number(val) : '')}
                  disabled={!data.state_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Suburb" />
                  </SelectTrigger>
                  <SelectContent>
                    {suburbs.map((su: Suburb) => (
                      <SelectItem key={su.id} value={String(su.id)}>{su.name} ({su.postcode})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError('suburb_id') && <p className="text-xs text-red-500 mt-1">{getError('suburb_id')}</p>}
              </div>
              
              {(!data.suburb_id || !suburbs.find((su: Suburb) => String(su.id) === String(data.suburb_id))?.postcode) && (
                <div className="space-y-2">
                  <label htmlFor="postcode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Postcode</label>
                  <Input
                    id="postcode"
                    name="postcode"
                    type="text"
                    value={data.postcode || ''}
                    onChange={e => setData('postcode', e.target.value)}
                    placeholder="Enter postcode"
                  />
                  {getError('postcode') && <p className="text-xs text-red-500 mt-1">{getError('postcode')}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
                <AddressAutofill
                  value={addressFormToAddress(data.address)}
                  onChange={handleAddressChange}
                />
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
                    placeholder="Region Name (optional)"
                    value={data.address?.region_name || ''}
                    onChange={e => setData('address', { ...data.address, region_name: e.target.value })}
                  />
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder="Latitude (optional)"
                    value={data.address?.latitude || ''}
                    onChange={e => setData('address', { ...data.address, latitude: e.target.value })}
                  />
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder="Longitude (optional)"
                    value={data.address?.longitude || ''}
                    onChange={e => setData('address', { ...data.address, longitude: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={data.address?.display_address_on_map ?? true}
                      onCheckedChange={checked => setData('address', { ...data.address, display_address_on_map: !!checked })}
                    />
                    <span>Display address on map</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={data.address?.display_street_view ?? true}
                      onCheckedChange={checked => setData('address', { ...data.address, display_street_view: !!checked })}
                    />
                    <span>Display street view</span>
                  </label>
                </div>
              </div>










              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price</label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={showPriceForm}
                    onCheckedChange={checked => {
                      setShowPriceForm(!!checked);
                      if (!checked) {
                        setData('price', undefined);
                      } else {
                        setData('price', {
                          ...defaultPriceForm,
                        });
                      }
                    }}
                  />
                  <span>Add Price Information</span>
                </div>
                {showPriceForm && data.price && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Price Type</label>
                      <Select
                        value={data.price.price_type}
                        onValueChange={val => setData('price', { ...defaultPriceForm, ...data.price, price_type: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Price Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="rent_weekly">Rent (Weekly)</SelectItem>
                          <SelectItem value="rent_monthly">Rent (Monthly)</SelectItem>
                          <SelectItem value="rent_yearly">Rent (Yearly)</SelectItem>
                          <SelectItem value="offers_above">Offers Above</SelectItem>
                          <SelectItem value="offers_between">Offers Between</SelectItem>
                          <SelectItem value="enquire">Enquire for Price</SelectItem>
                          <SelectItem value="contact">Contact for Price</SelectItem>
                          <SelectItem value="call">Call for Price</SelectItem>
                          <SelectItem value="negotiable">Negotiable</SelectItem>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="tba">TBA</SelectItem>
                        </SelectContent>
                      </Select>
                      {getError('price.price_type') && <p className="text-xs text-red-500 mt-1">{getError('price.price_type')}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tax Status</label>
                      <Select
                        value={data.price.tax}
                        onValueChange={val => setData('price', { ...defaultPriceForm, ...data.price, tax: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Tax Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">Unknown</SelectItem>
                          <SelectItem value="exempt">Exempt</SelectItem>
                          <SelectItem value="inclusive">Inclusive</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                      {getError('price.tax') && <p className="text-xs text-red-500 mt-1">{getError('price.tax')}</p>}
                    </div>
                    {data.price.price_type === 'offers_between' ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Minimum Amount</label>
                          <Input
                            type="number"
                            min="1000"
                            value={data.price.range_min || ''}
                            onChange={e => setData('price', { ...defaultPriceForm, ...data.price, range_min: e.target.value })}
                            placeholder="e.g., 400000"
                          />
                          {getError('price.range_min') && <p className="text-xs text-red-500 mt-1">{getError('price.range_min')}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Maximum Amount</label>
                          <Input
                            type="number"
                            min="1000"
                            value={data.price.range_max || ''}
                            onChange={e => setData('price', { ...defaultPriceForm, ...data.price, range_max: e.target.value })}
                            placeholder="e.g., 500000"
                          />
                          {getError('price.range_max') && <p className="text-xs text-red-500 mt-1">{getError('price.range_max')}</p>}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Amount</label>
                        <Input
                          type="number"
                          min="1000"
                          value={data.price.amount || ''}
                          onChange={e => setData('price', { ...defaultPriceForm, ...data.price, amount: e.target.value })}
                          placeholder="e.g., 450000"
                          disabled={['enquire', 'contact', 'call', 'tba'].includes(data.price.price_type)}
                        />
                        {getError('price.amount') && <p className="text-xs text-red-500 mt-1">{getError('price.amount')}</p>}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Custom Label (optional)</label>
                      <Input
                        type="text"
                        value={data.price.label || ''}
                        onChange={e => setData('price', { ...defaultPriceForm, ...data.price, label: e.target.value })}
                        placeholder="e.g., Offers above $400,000"
                      />
                      {getError('price.label') && <p className="text-xs text-red-500 mt-1">{getError('price.label')}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={data.price.hide_amount}
                        onCheckedChange={checked => setData('price', { ...defaultPriceForm, ...data.price, hide_amount: !!checked })}
                      />
                      <label className="text-xs text-zinc-700 dark:text-zinc-300">Hide Amount (show label instead)</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={data.price.display}
                        onCheckedChange={checked => setData('price', { ...defaultPriceForm, ...data.price, display: !!checked })}
                      />
                      <label className="text-xs text-zinc-700 dark:text-zinc-300">Display Price</label>
                    </div>
                    {data.price.penalize_search && (
                      <p className="text-xs text-yellow-500 mt-2">
                        Warning: Non-numeric or hidden prices will be ranked lower in search results and excluded from price range filters.
                      </p>
                    )}
                  </div>
                )}
              </div>
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
                {getError('slug') && <p className="text-xs text-red-500 mt-1">{getError('slug')}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={processing} size="lg">Update Property</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
