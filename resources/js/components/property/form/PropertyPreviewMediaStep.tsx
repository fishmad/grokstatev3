import React from 'react';
import { Button } from '@/components/ui/button';

export default function PropertyPreviewMediaStep({ data, setData, errors, prevStep }: any) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Preview & Media</h2>
      {/* TODO: Add media upload and preview summary UI here */}
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={prevStep}>Back</Button>
        {/* No next button, this is the last step */}
      </div>
    </div>
  );
}
