import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function PropertyDetailsStep({ data, setData, errors, nextStep, prevStep }: any) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Property Details</h2>
      <div className="space-y-4">
        <Input id="title" name="title" value={data.title || ''} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
        <Textarea id="description" name="description" value={data.description || ''} onChange={e => setData('description', e.target.value)} placeholder="Description" rows={4} />
        <Input type="number" placeholder="Beds" value={data.beds || ''} onChange={e => setData('beds', e.target.value)} />
        <Input type="number" placeholder="Baths" value={data.baths || ''} onChange={e => setData('baths', e.target.value)} />
        <Input type="number" placeholder="Land Size" value={data.land_size || ''} onChange={e => setData('land_size', e.target.value)} />
        <Input type="number" placeholder="Garage Spaces" value={data.garage_spaces || ''} onChange={e => setData('garage_spaces', e.target.value)} />
      </div>
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
