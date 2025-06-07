import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function WizardStep5Details({ data, setData, errors, nextStep, prevStep }: any) {
  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Property Details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Property Title (Catch phrase heading)</label>
          <Input id="title" name="title" value={data.title || ''} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
          <Textarea id="description" name="description" value={data.description || ''} onChange={e => setData('description', e.target.value)} placeholder="Description" rows={8} className="min-h-[160px]" />
        </div>
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="flex-1">
            <label htmlFor="beds" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Beds</label>
            <Select value={data.beds === undefined || data.beds === null ? 'unset' : String(data.beds)} onValueChange={val => setData('beds', val === 'unset' ? null : Number(val))}>
              <SelectTrigger id="beds">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">None</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="baths" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Baths</label>
            <Select value={data.baths === undefined || data.baths === null ? 'unset' : String(data.baths)} onValueChange={val => setData('baths', val === 'unset' ? null : Number(val))}>
              <SelectTrigger id="baths">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">None</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="parking_spaces" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Parking Spaces</label>
            <Select value={data.parking_spaces === undefined || data.parking_spaces === null ? 'unset' : String(data.parking_spaces)} onValueChange={val => setData('parking_spaces', val === 'unset' ? null : Number(val))}>
              <SelectTrigger id="parking_spaces">
                <SelectValue placeholder="Parking" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">None</SelectItem>
                 <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="flex-1">
            <label htmlFor="land_size" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Land Size</label>
            <Input id="land_size" type="number" placeholder="Land Size" value={data.land_size || ''} onChange={e => setData('land_size', e.target.value)} />
          </div>
          <div className="flex-1">
            <label htmlFor="land_size_unit" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Unit</label>
            <Select value={data.land_size_unit ?? 'sqm'} onValueChange={val => setData('land_size_unit', val)}>
              <SelectTrigger id="land_size_unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">None</SelectItem>
                <SelectItem value="sqm">sqm</SelectItem>
                <SelectItem value="acre">acre</SelectItem>

              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="building_size" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Building Size</label>
            <Input id="building_size" type="number" placeholder="Building Size" value={data.building_size || ''} onChange={e => setData('building_size', e.target.value)} />
          </div>
          <div className="flex-1">
            <label htmlFor="building_size_unit" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Unit</label>
            <Select value={data.building_size_unit ?? 'sqft'} onValueChange={val => setData('building_size_unit', val)}>
              <SelectTrigger id="building_size_unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">None</SelectItem>
                <SelectItem value="sqm">sqm</SelectItem>
                <SelectItem value="sqft">sqft</SelectItem>
  
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
