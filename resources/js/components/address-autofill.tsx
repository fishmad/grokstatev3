import React, { useRef, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export interface AddressAutofillProps {
  value?: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
}

export interface Address {
  street_number?: string;
  street_name?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export default function AddressAutofill({ value, onChange }: AddressAutofillProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
      types: ['address'],
      fields: ['address_components', 'geometry'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;
      const get = (type: string) => {
        const comp = place.address_components!.find((c: any) => c.types.includes(type));
        return comp ? comp.long_name : '';
      };
      const address: Address = {
        street_number: get('street_number'),
        street_name: get('route'),
        suburb: get('locality') || get('sublocality') || get('postal_town'),
        postcode: get('postal_code'),
        state: get('administrative_area_level_1'),
        country: get('country'),
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      };
      onChange(address);
    });
    return () => {
      window.google.maps.event.clearInstanceListeners(inputRef.current!);
    };
  }, [onChange]);

  return (
    <input
      id="address-input"
      ref={inputRef}
      type="text"
      className="input input-bordered w-full"
      placeholder="Start typing address..."
      value={value?.street_name || ''}
      onChange={e => onChange({ ...value, street_name: e.target.value })}
    />
  );
}
