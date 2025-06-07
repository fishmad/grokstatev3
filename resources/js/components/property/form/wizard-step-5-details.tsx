import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function WizardStep5Details({ data, setData, errors, nextStep, prevStep }: any) {
  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Property Details</h2>
      <div className="space-y-4">
        <Input id="title" name="title" value={data.title || ''} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
        <Textarea id="description" name="description" value={data.description || ''} onChange={e => setData('description', e.target.value)} placeholder="Description" rows={4} />
        <Input type="number" placeholder="Beds" value={data.beds || ''} onChange={e => setData('beds', e.target.value)} />
        <Input type="number" placeholder="Baths" value={data.baths || ''} onChange={e => setData('baths', e.target.value)} />
        <Input type="number" placeholder="Parking Spaces" value={data.parking_spaces || ''} onChange={e => setData('parking_spaces', e.target.value)} />
        {/* <Input type="number" placeholder="Ensuites" value={data.ensuites || ''} onChange={e => setData('ensuites', e.target.value)} />
        <Input type="number" placeholder="Garage Spaces" value={data.garage_spaces || ''} onChange={e => setData('garage_spaces', e.target.value)} /> */}
        <div className="flex gap-2">
          <Input type="number" placeholder="Land Size" value={data.land_size || ''} onChange={e => setData('land_size', e.target.value)} />
          <Select value={data.land_size_unit || ''} onValueChange={val => setData('land_size_unit', val)}>
            <SelectTrigger id="land_size_unit">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqm">sqm</SelectItem>
              <SelectItem value="acre">acre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Input type="number" placeholder="Building Size" value={data.building_size || ''} onChange={e => setData('building_size', e.target.value)} />
          <Select value={data.building_size_unit || ''} onValueChange={val => setData('building_size_unit', val)}>
            <SelectTrigger id="building_size_unit">
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
  );
}
