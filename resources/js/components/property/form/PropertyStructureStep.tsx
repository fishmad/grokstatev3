import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PropertyStructureStep({ data, setData, propertyTypes, listingMethods, listingStatuses, errors, nextStep, prevStep }: any) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Structure, Listing, Price</h2>
      <div className="space-y-4">
        <label className="block text-sm font-medium">Property Type</label>
        <select className="input input-bordered w-full" value={data.property_type_id || ''} onChange={e => setData('property_type_id', e.target.value)} required>
          <option value="">Select Type</option>
          {propertyTypes && propertyTypes.map((t: any) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <label className="block text-sm font-medium">Listing Method</label>
        <select className="input input-bordered w-full" value={data.listing_method_id || ''} onChange={e => setData('listing_method_id', e.target.value)} required>
          <option value="">Select Method</option>
          {listingMethods && listingMethods.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <label className="block text-sm font-medium">Listing Status</label>
        <select className="input input-bordered w-full" value={data.listing_status_id || ''} onChange={e => setData('listing_status_id', e.target.value)} required>
          <option value="">Select Status</option>
          {listingStatuses && listingStatuses.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {/* Price input (can be replaced with PricesInput component) */}
        <Input type="number" placeholder="Price" value={data.price || ''} onChange={e => setData('price', e.target.value)} />
      </div>
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
