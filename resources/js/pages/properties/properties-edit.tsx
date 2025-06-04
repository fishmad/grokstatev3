import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AddressAutofill from '@/components/address-autofill';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function PropertiesEdit({ property, propertyTypes, listingMethods, listingStatuses, categories, features }: any) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Properties', href: '/properties' },
    { title: property.title, href: '#' },
    { title: 'Edit', href: '#' },
  ];
  
  const { data, setData, put, processing, errors } = useForm({
    title: property.title || '',
    description: property.description || '',
    property_type_id: property.property_type_id || '',
    listing_method_id: property.listing_method_id || '',
    listing_status_id: property.listing_status_id || '',
    categories: property.categories?.map((c: any) => String(c.id)) || [],
    features: property.features?.map((f: any) => String(f.id)) || [],
    address: property.address || {},
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Property" />
      <div className="w-full max-w-full px-0 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Property</h1>
          <Button asChild>
            <a href="/properties" className="ml-auto">Back to List</a>
          </Button>
        </div>
        <form className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-6 border border-zinc-200 dark:border-zinc-800" onSubmit={e => { e.preventDefault(); put(`/properties/${property.id}`); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input className="input input-bordered w-full" name="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
              <textarea className="input input-bordered w-full" name="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Description" />
              <select className="input input-bordered w-full" name="property_type_id" value={data.property_type_id} onChange={e => setData('property_type_id', e.target.value)} required>
                <option value="">Select Property Type</option>
                {propertyTypes.map((pt: any) => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
              </select>
              <select className="input input-bordered w-full" name="listing_method_id" value={data.listing_method_id} onChange={e => setData('listing_method_id', e.target.value)} required>
                <option value="">Select Listing Method</option>
                {listingMethods.map((lm: any) => <option key={lm.id} value={lm.id}>{lm.name}</option>)}
              </select>
              <select className="input input-bordered w-full" name="listing_status_id" value={data.listing_status_id} onChange={e => setData('listing_status_id', e.target.value)} required>
                <option value="">Select Listing Status</option>
                {listingStatuses.map((ls: any) => <option key={ls.id} value={ls.id}>{ls.name}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <select className="input input-bordered w-full" name="categories" multiple value={data.categories} onChange={e => setData('categories', Array.from(e.target.selectedOptions, o => o.value as string))}>
                {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <select className="input input-bordered w-full" name="features" multiple value={data.features} onChange={e => setData('features', Array.from(e.target.selectedOptions, o => o.value as string))}>
                {features.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <AddressAutofill value={data.address} onChange={val => setData('address', val)} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={processing}>Update</Button>
          {errors && <div className="text-red-500 mt-2">{Object.values(errors).join(', ')}</div>}
        </form>
      </div>
    </AppLayout>
  );
}
