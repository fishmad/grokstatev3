import React from 'react';

export interface AddressAutofillProps {
  value?: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
}

export interface Address {
  street_number?: string;
  street_name?: string;
  suburb?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export default function AddressAutofill({ value, onChange }: AddressAutofillProps) {
  // Placeholder: Integrate Google Places API here
  return (
    <input
      id="address-input"
      type="text"
      className="input input-bordered w-full"
      placeholder="Start typing address..."
      onChange={e => {
        // TODO: Call Google Places API and extract address parts
        onChange({ ...value, street_name: e.target.value });
      }}
      value={value?.street_name || ''}
    />
  );
}
