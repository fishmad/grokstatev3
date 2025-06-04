import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AddressAutofill from '@/components/address-autofill';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Properties', href: '/properties' },
  { title: 'Create', href: '/properties/create' },
];

export default function PropertiesCreate({ propertyTypes, listingMethods, listingStatuses, categories, features }: any) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    property_type_id: '',
    listing_method_id: '',
    listing_status_id: '',
    categories: [] as string[],
    features: [] as string[],
    address: {},
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Property" />
      <form className="max-w-2xl mx-auto p-4 bg-white rounded shadow space-y-4" onSubmit={e => { e.preventDefault(); post('/properties'); }}>
        <h1 className="text-2xl font-bold mb-4">Create Property</h1>
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
        <select className="input input-bordered w-full" name="categories" multiple value={data.categories} onChange={e => setData('categories', Array.from(e.target.selectedOptions, o => o.value as string))}>
          {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select className="input input-bordered w-full" name="features" multiple value={data.features} onChange={e => setData('features', Array.from(e.target.selectedOptions, o => o.value as string))}>
          {features.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <AddressAutofill value={data.address} onChange={val => setData('address', val)} />
        <button type="submit" className="btn btn-primary w-full" disabled={processing}>Create</button>
        {errors && <div className="text-red-500 mt-2">{Object.values(errors).join(', ')}</div>}
      </form>
    </AppLayout>
  );
}
