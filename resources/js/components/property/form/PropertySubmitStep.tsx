import React from 'react';
import { Button } from '@/components/ui/button';

export default function PropertySubmitStep({ data, handleSubmit, processing, prevStep }: any) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Submit</h2>
      {/* TODO: Add summary/review UI here */}
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={handleSubmit} disabled={processing}>Submit</Button>
      </div>
    </div>
  );
}
