import React, { useState, useRef, useEffect } from 'react';
import GoogleAddressMapInput from './google-address-map-input';
import { Input } from '@/components/ui/input';

export default function WizardStep4Location({ data, setData, errors, nextStep, countries = [], states = [], suburbs = [], active }: any) {
  const [placeType, setPlaceType] = useState<string | null>(null);
  const mapInputRef = useRef<any>(null);

  function handleAddressChange(addr: any) {
    // Start with the merged address
    let updatedAddress = { ...data.address, ...addr };

    // Auto-select Country by name if present and not already set
    if (addr.country && countries.length) {
      const countryMatch = countries.find((c: any) => c.name.toLowerCase() === addr.country.toLowerCase());
      if (countryMatch) {
        updatedAddress.country_id = String(countryMatch.id);
      }
    }

    // Auto-select State by name if present and not already set
    if (addr.state && states.length) {
      const stateMatch = states.find((s: any) => s.name.toLowerCase() === addr.state.toLowerCase());
      if (stateMatch) {
        updatedAddress.state_id = String(stateMatch.id);
      }
    }

    // Auto-select Suburb by name if present and not already set
    if (addr.suburb && suburbs.length) {
      const suburbMatch = suburbs.find((su: any) => su.name.toLowerCase() === addr.suburb.toLowerCase());
      if (suburbMatch) {
        updatedAddress.suburb_id = String(suburbMatch.id);
        updatedAddress.postcode = suburbMatch.postcode;
      }
    }

    setData('address', updatedAddress);
    if (addr.place_type) setPlaceType(addr.place_type);
  }

  useEffect(() => {
    if (active && mapInputRef.current && mapInputRef.current.resizeMap) {
      setTimeout(() => {
        mapInputRef.current.resizeMap();
      }, 100);
    }
  }, [active]);

  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Address for Property</h2>
      <GoogleAddressMapInput
        ref={mapInputRef}
        value={data.address}
        onChange={handleAddressChange}
      />
      {placeType && (
        <div className="mt-2 text-sm text-blue-700">Detected place type: <strong>{placeType}</strong></div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input type="text" placeholder="Street Number" value={data.address?.street_number || ''} onChange={e => setData('address', { ...data.address, street_number: e.target.value })} />
        <Input type="text" placeholder="Street Name" value={data.address?.street_name || ''} onChange={e => setData('address', { ...data.address, street_name: e.target.value })} required />
        <Input type="text" placeholder="Unit Number (optional)" value={data.address?.unit_number || ''} onChange={e => setData('address', { ...data.address, unit_number: e.target.value })} />
        <Input type="text" placeholder="Lot Number (optional)" value={data.address?.lot_number || ''} onChange={e => setData('address', { ...data.address, lot_number: e.target.value })} />
        <Input type="text" placeholder="Site Name (optional)" value={data.address?.site_name || ''} onChange={e => setData('address', { ...data.address, site_name: e.target.value })} />
        <Input type="text" placeholder="Region Name (optional)" value={data.address?.region_name || ''} onChange={e => setData('address', { ...data.address, region_name: e.target.value })} />
        <Input type="number" step="0.00000001" placeholder="Latitude (optional)" value={data.address?.lat || ''} onChange={e => setData('address', { ...data.address, lat: e.target.value })} />
        <Input type="number" step="0.00000001" placeholder="Longitude (optional)" value={data.address?.long || ''} onChange={e => setData('address', { ...data.address, long: e.target.value })} />
        <Input type="text" placeholder="Country" value={data.address?.country || ''} onChange={e => setData('address', { ...data.address, country: e.target.value })} required />
        <Input type="text" placeholder="State" value={data.address?.state || ''} onChange={e => setData('address', { ...data.address, state: e.target.value })} required />
        <Input type="text" placeholder="Suburb" value={data.address?.suburb || ''} onChange={e => setData('address', { ...data.address, suburb: e.target.value })} required />
        <Input type="text" placeholder="Postcode" value={data.address?.postcode || ''} onChange={e => setData('address', { ...data.address, postcode: e.target.value })} required />
      </div>
    </div>
  );
}
