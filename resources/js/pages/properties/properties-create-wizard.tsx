import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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

// --- Step 1: Basic Info ---
function StepBasicInfo({ data, setData, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <Input id="title" name="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Textarea id="description" name="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Description" rows={4} />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
    </div>
  );
}

// --- Step 2: Categories & Features ---
function StepCategories({ data, setData, categoryGroups, featureGroups, selectedTopLevelCategory, setSelectedTopLevelCategory, errors }: any) {
  const mainCategoryGroup = Array.isArray(categoryGroups) && categoryGroups.length > 0 ? categoryGroups[0] : null;
  const topLevelCategories = mainCategoryGroup && mainCategoryGroup.categories ? mainCategoryGroup.categories : [];
  const selectedCategoryObj = topLevelCategories.find((cat: any) => cat.id === selectedTopLevelCategory);
  const childCategories = selectedCategoryObj?.children || [];

  return (
    <div className="space-y-6">
      {/* Category selection (copied from your form) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Category</label>
        <div className="space-y-4">
          {/* Step 1: Top-level category selection */}
          <div>
            <div className="font-semibold mb-1">Step 1: Select a top-level category</div>
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
                    className="accent-blue-600 w-4 h-4 rounded"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
          {/* Step 2: Child category selection */}
          {selectedTopLevelCategory && childCategories.length > 0 && (
            <div>
              <div className="font-semibold mb-1 mt-4">Step 2: Select subcategories</div>
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
                      className="accent-blue-600 w-4 h-4 rounded"
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
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryFinal"
                  value={selectedTopLevelCategory}
                  checked={data.categories[0] === selectedTopLevelCategory}
                  onChange={() => setData('categories', [selectedTopLevelCategory])}
                  className="accent-blue-600 w-4 h-4 rounded"
                />
                <span>Use {selectedCategoryObj?.name}</span>
              </label>
            </div>
          )}
        </div>
        {errors.categories && <p className="text-xs text-red-500">{errors.categories}</p>}
      </div>
      {/* Features */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Features</label>
        <div className="space-y-4">
          {featureGroups.map((group: any) => (
            <div key={group.id}>
              <div className="font-semibold mb-1">{group.name}</div>
              <div className="grid grid-cols-2 gap-2">
                {group.features.map((f: any) => (
                  <label key={f.id} className="flex items-center gap-2">
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
                      className="accent-blue-600 w-4 h-4 rounded"
                    />
                    <span>{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {errors.features && <p className="text-xs text-red-500">{errors.features}</p>}
      </div>
    </div>
  );
}

// --- Step 3: Address ---
function StepAddress({ data, setData, countries, states, suburbs, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="text" placeholder="Street Number" value={data.address?.street_number || ''} onChange={e => setData('address', { ...data.address, street_number: e.target.value })} />
        <Input type="text" placeholder="Street Name" value={data.address?.street_name || ''} onChange={e => setData('address', { ...data.address, street_name: e.target.value })} required />
        <Input type="text" placeholder="Unit Number (optional)" value={data.address?.unit_number || ''} onChange={e => setData('address', { ...data.address, unit_number: e.target.value })} />
        <Input type="text" placeholder="Lot Number (optional)" value={data.address?.lot_number || ''} onChange={e => setData('address', { ...data.address, lot_number: e.target.value })} />
        <Input type="text" placeholder="Site Name (optional)" value={data.address?.site_name || ''} onChange={e => setData('address', { ...data.address, site_name: e.target.value })} />
        <Input type="text" placeholder="Region Name (optional)" value={data.address?.region_name || ''} onChange={e => setData('address', { ...data.address, region_name: e.target.value })} />
        <Input type="number" step="0.00000001" placeholder="Latitude (optional)" value={data.address?.lat || ''} onChange={e => setData('address', { ...data.address, lat: e.target.value })} />
        <Input type="number" step="0.00000001" placeholder="Longitude (optional)" value={data.address?.long || ''} onChange={e => setData('address', { ...data.address, long: e.target.value })} />
      </div>
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.address?.display_address_on_map ?? true} onChange={e => setData('address', { ...data.address, display_address_on_map: e.target.checked })} />
          <span>Display address on map</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.address?.display_street_view ?? true} onChange={e => setData('address', { ...data.address, display_street_view: e.target.checked })} />
          <span>Display street view</span>
        </label>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Country</label>
        <select className="input input-bordered w-full" value={data.country_id || ''} onChange={e => setData('country_id', e.target.value ? Number(e.target.value) : '')} required>
          <option value="">Select Country</option>
          {countries.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.country_id && <p className="text-xs text-red-500">{errors.country_id}</p>}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">State</label>
        <select className="input input-bordered w-full" value={data.state_id || ''} onChange={e => setData('state_id', e.target.value ? Number(e.target.value) : '')} required disabled={!data.country_id}>
          <option value="">Select State</option>
          {states.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.state_id && <p className="text-xs text-red-500">{errors.state_id}</p>}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Suburb</label>
        <select className="input input-bordered w-full" value={data.suburb_id || ''} onChange={e => setData('suburb_id', e.target.value ? Number(e.target.value) : '')} required disabled={!data.state_id}>
          <option value="">Select Suburb</option>
          {suburbs.map((su: any) => (
            <option key={su.id} value={su.id}>{su.name} ({su.postcode})</option>
          ))}
        </select>
        {errors.suburb_id && <p className="text-xs text-red-500">{errors.suburb_id}</p>}
      </div>
      {(!data.suburb_id || !suburbs.find((su: any) => String(su.id) === String(data.suburb_id))?.postcode) && (
        <div className="space-y-2">
          <label htmlFor="postcode" className="block text-sm font-medium">Postcode</label>
          <Input id="postcode" name="postcode" type="text" value={data.postcode || ''} onChange={e => setData('postcode', e.target.value)} required placeholder="Enter postcode" />
          {errors.postcode && <p className="text-xs text-red-500">{errors.postcode}</p>}
        </div>
      )}
    </div>
  );
}

// --- Step 4: Prices & Attributes ---
function StepPricesAttributes({ data, setData, attributes, setAttributes, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Dynamic Attributes (JSON)</label>
        <div className="space-y-2">
          {attributes.map((attr: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input type="text" placeholder="Attribute Name" value={attr.key} onChange={e => { const newAttrs = [...attributes]; newAttrs[idx].key = e.target.value; setAttributes(newAttrs); }} className="w-1/2" />
              <Input type="text" placeholder="Value" value={attr.value} onChange={e => { const newAttrs = [...attributes]; newAttrs[idx].value = e.target.value; setAttributes(newAttrs); }} className="w-1/2" />
              <Button type="button" variant="ghost" onClick={() => setAttributes(attributes.filter((_: any, i: number) => i !== idx))}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setAttributes([...attributes, { key: '', value: '' }])}>Add Attribute</Button>
        </div>
        <p className="text-xs text-zinc-500">Add custom key-value pairs for this property. These will be stored as JSON.</p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Prices</label>
        <PricesInput prices={data.prices || []} setPrices={(prices: any) => setData('prices', prices)} />
      </div>
    </div>
  );
}

// --- Step 5: Media & Review ---
function StepMediaReview({ data, setData, errors, progress }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="media" className="block text-sm font-medium">Media Upload</label>
        <Input id="media" type="file" name="media" multiple className="input input-bordered w-full" onChange={e => setData('media', e.target.files ? Array.from(e.target.files) : [])} />
        {progress && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
          </div>
        )}
        {errors.media && <p className="text-xs text-red-500 mt-1">{errors.media}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="slug" className="block text-sm font-medium">Slug (optional)</label>
        <Input id="slug" name="slug" value={data.slug || ''} onChange={e => setData('slug', e.target.value)} placeholder="property-title-or-custom-slug" autoComplete="off" />
        <p className="text-xs text-zinc-500">Leave blank to auto-generate from title.</p>
      </div>
      {/* Review summary (optional) */}
      <div className="mt-4 p-4 bg-zinc-100 rounded">
        <strong>Review your property details before submitting.</strong>
        {/* You can add a summary table here if desired */}
      </div>
    </div>
  );
}

// --- Wizard Steps Array ---
const steps = [
  { label: 'Basic Info', component: StepBasicInfo },
  { label: 'Categories', component: StepCategories },
  { label: 'Address', component: StepAddress },
  { label: 'Prices & Attributes', component: StepPricesAttributes },
  { label: 'Media & Review', component: StepMediaReview },
];

// --- Main Wizard Component ---
export default function PropertiesCreateWizard(props: any) {
  const { propertyTypes, listingMethods, listingStatuses, categoryGroups, featureGroups } = props;
  const [step, setStep] = useState(0);
  const [selectedTopLevelCategory, setSelectedTopLevelCategory] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [suburbs, setSuburbs] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- useForm initial state (copy from your current form) ---
  const { data, setData, post, processing, errors, progress } = useForm({
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
    country_id: '',
    state_id: '',
    suburb_id: '',
    postcode: '',
  });

  // --- Dynamic Attributes state sync ---
  useEffect(() => {
    setData('dynamic_attributes', attributes.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>));
  }, [attributes, setData]);

  // --- Fetch countries/states/suburbs ---
  useEffect(() => {
    fetch('/api/countries').then(res => res.json()).then(setCountries).catch(() => setCountries([]));
  }, []);
  useEffect(() => {
    if (data.country_id) {
      fetch(`/api/states/${data.country_id}`).then(res => res.json()).then(setStates).catch(() => setStates([]));
    } else {
      setStates([]);
    }
  }, [data.country_id]);
  useEffect(() => {
    if (data.state_id) {
      fetch(`/api/suburbs/${data.state_id}`).then(res => res.json()).then(setSuburbs).catch(() => setSuburbs([]));
    } else {
      setSuburbs([]);
    }
  }, [data.state_id]);

  // --- Per-step validation ---
  function validateStep(stepIdx: number): string[] {
    const errs: string[] = [];
    if (stepIdx === 0) {
      if (!data.title) errs.push('Title is required');
      if (!data.description) errs.push('Description is required');
    }
    if (stepIdx === 1) {
      if (!data.categories || data.categories.length === 0) errs.push('At least one category is required');
    }
    if (stepIdx === 2) {
      if (!data.address?.street_name) errs.push('Street name is required');
      if (!data.country_id) errs.push('Country is required');
      if (!data.state_id) errs.push('State is required');
      if (!data.suburb_id) errs.push('Suburb is required');
      if (!data.postcode) errs.push('Postcode is required');
    }
    // You can add more validation for other steps as needed
    return errs;
  }

  // --- Final submission logic (flatten/transform as in your current form) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    const submission: Record<string, any> = { ...data };
    if (data.address) {
      const addressFields = [
        'street_name', 'street_number', 'unit_number', 'lot_number', 'site_name', 'region_name',
        'lat', 'long', 'display_address_on_map', 'display_street_view'
      ];
      addressFields.forEach(field => {
        submission[field] = data.address[field as keyof typeof data.address] ?? '';
      });
      delete submission.address;
    }
    const selectedSuburb = suburbs.find((su: any) => String(su.id) === String(data.suburb_id));
    if (selectedSuburb?.postcode) submission.postcode = selectedSuburb.postcode;
    submission.prices = JSON.stringify(data.prices ?? []);
    submission.dynamic_attributes = JSON.stringify(data.dynamic_attributes ?? {});
    if (!submission.street_name) submission.street_name = '';
    if (!submission.prices) submission.prices = '[]';
    post('/properties', submission, {
      forceFormData: true,
      onSuccess: () => setSuccessMessage('Property created successfully!'),
      onError: (errors: any) => {
        setSuccessMessage(null);
        console.error('Form submission error:', errors);
      },
    });
  };

  // --- Navigation logic ---
  const stepErrors = validateStep(step);
  const CurrentStep = steps[step].component;

  return (
    <AppLayout breadcrumbs={[]}> 
      <Head title="Create Property (Wizard)" />
      <form onSubmit={step === steps.length - 1 ? handleSubmit : e => { e.preventDefault(); if (stepErrors.length === 0) setStep(step + 1); }}>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.label} className={`px-3 py-1 rounded-full ${i === step ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <CurrentStep
          data={data}
          setData={setData}
          errors={errors}
          propertyTypes={propertyTypes}
          listingMethods={listingMethods}
          listingStatuses={listingStatuses}
          categoryGroups={categoryGroups}
          featureGroups={featureGroups}
          attributes={attributes}
          setAttributes={setAttributes}
          countries={countries}
          states={states}
          suburbs={suburbs}
          selectedTopLevelCategory={selectedTopLevelCategory}
          setSelectedTopLevelCategory={setSelectedTopLevelCategory}
          progress={progress}
        />
        {stepErrors.length > 0 && (
          <div className="my-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
            {stepErrors.map((err, idx) => <div key={idx}>{err}</div>)}
          </div>
        )}
        <div className="flex justify-between mt-8">
          <Button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={() => { if (stepErrors.length === 0) setStep(s => Math.min(steps.length - 1, s + 1)); }} disabled={stepErrors.length > 0}>Next</Button>
          ) : (
            <Button type="submit" disabled={processing}>Submit</Button>
          )}
        </div>
        {successMessage && (
          <div className="my-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
            {successMessage}
          </div>
        )}
      </form>
    </AppLayout>
  );
}
