import React, { useRef, useEffect, useState } from 'react';

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
  // Local state for the display string
  const [displayValue, setDisplayValue] = useState('');

  // Update displayValue when value prop changes (autofill or parent update)
  useEffect(() => {
    const str = [
      value?.street_number,
      value?.street_name,
      value?.suburb,
      value?.state,
      value?.postcode,
      value?.country
    ].filter(Boolean).join(', ');
    setDisplayValue(str);
  }, [value]);

  useEffect(() => {
    if (!window.google || !window.google.maps || !inputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
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
      // Update display string
      setDisplayValue([
        address.street_number,
        address.street_name,
        address.suburb,
        address.state,
        address.postcode,
        address.country
      ].filter(Boolean).join(', '));
    });
    return () => {
      if (inputRef.current) {
        window.google.maps.event.clearInstanceListeners(inputRef.current);
      }
    };
  }, [onChange]);

  return (
    <input
      id="address-input"
      ref={inputRef}
      type="text"
      className="input input-bordered w-full"
      placeholder="Start typing address..."
      value={displayValue}
      onChange={e => {
        setDisplayValue(e.target.value);
        // Optionally, update only street_name for now, or parse further if needed
        onChange({ ...value, street_name: e.target.value });
      }}
    />
  );
}
