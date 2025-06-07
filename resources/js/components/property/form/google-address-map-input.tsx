import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

// Shoalhaven region default (Nowra, NSW):
const defaultCenter = { lat: -34.397, lng: 150.644 }; // Shoalhaven, Nowra

export interface GoogleAddressMapInputProps {
  value?: any;
  onChange: (address: any) => void;
}

const GoogleAddressMapInput = forwardRef(function GoogleAddressMapInput({ value, onChange }: GoogleAddressMapInputProps, ref) {
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [address, setAddress] = useState<string>(value?.formatted_address || '');
  const [marker, setMarker] = useState<{ lat: number; lng: number }>(
    value?.lat && value?.lng
      ? { lat: Number(value.lat), lng: Number(value.lng) }
      : defaultCenter // Default to Shoalhaven if no value
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [streetNumber, setStreetNumber] = useState<string>(value?.street_number || '');
  const [streetName, setStreetName] = useState<string>(value?.street_name || '');
  const [suburb, setSuburb] = useState<string>(value?.suburb || '');
  const [postcode, setPostcode] = useState<string>(value?.postcode || '');
  const [state, setState] = useState<string>(value?.state || '');
  const [country, setCountry] = useState<string>(value?.country || '');

  // Load Google Maps JS API with Map ID
  useEffect(() => {
    if (window.google && window.google.maps && mapLoaded) return;
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapLoaded(true));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,marker&map_ids=${import.meta.env.VITE_GOOGLE_MAP_ID}`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize map, marker, and autocomplete
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: marker,
      zoom: 8, // Zoomed out for Shoalhaven region
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      disableDefaultUI: false,
    });
    mapInstanceRef.current = map;
    // Advanced Marker
    const { AdvancedMarkerElement } = google.maps.marker;
    markerRef.current = new AdvancedMarkerElement({
      map,
      position: marker,
    });
    // Map click handler
    map.addListener('click', async (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      markerRef.current.position = { lat, lng };
      setMarker({ lat, lng });
      // Reverse geocode to get address components
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const place = results[0];
          setAddress(place.formatted_address || '');
          // Extract address components
          const get = (type: string) => {
            const comp = place.address_components?.find((c: any) => c.types.includes(type));
            return comp ? comp.long_name : '';
          };
          const street_number = get('street_number');
          const street_name = get('route');
          const suburbVal = get('locality') || get('sublocality') || get('postal_town');
          const postcodeVal = get('postal_code');
          const stateVal = get('administrative_area_level_1');
          const countryVal = get('country');
          const region_name = get('administrative_area_level_2');
          const unit_number = get('subpremise');
          const municipality = get('administrative_area_level_1');
          setStreetNumber(street_number);
          setStreetName(street_name);
          setSuburb(suburbVal);
          setPostcode(postcodeVal);
          setState(stateVal);
          setCountry(countryVal);
          onChange({
            street_number,
            street_name,
            unit_number,
            region_name, // <-- add region_name to payload
            site_name: municipality, // <-- set site_name to level 1
            suburb: suburbVal,
            postcode: postcodeVal,
            state: stateVal,
            country: countryVal,
            lat,
            lng,
            long: lng,
            formatted_address: place.formatted_address,
          });
        } else {
          // If geocode fails, just update lat/lng
          onChange({ ...value, lat, lng, long: lng });
        }
      });
    });
    // Place Autocomplete
    const input = document.getElementById('gmp-place-autocomplete') as HTMLInputElement;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input, { fields: ['address_components', 'geometry', 'formatted_address'] });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setAddress(place.formatted_address || '');
        setMarker({ lat, lng });
        map.setCenter({ lat, lng });
        markerRef.current.position = { lat, lng };
        // Extract address components
        const get = (type: string) => {
          const comp = place.address_components?.find((c: any) => c.types.includes(type));
          return comp ? comp.long_name : '';
        };
        const street_number = get('street_number');
        const street_name = get('route');
        const suburbVal = get('locality') || get('sublocality') || get('postal_town');
        const postcodeVal = get('postal_code');
        const stateVal = get('administrative_area_level_1');
        const countryVal = get('country');
        const region_name = get('administrative_area_level_2');
        const unit_number = get('subpremise');
        const municipality = get('administrative_area_level_1');
        setStreetNumber(street_number);
        setStreetName(street_name);
        setSuburb(suburbVal);
        setPostcode(postcodeVal);
        setState(stateVal);
        setCountry(countryVal);
        onChange({
          street_number,
          street_name,
          unit_number,
          region_name, // <-- add region_name to payload
          site_name: municipality, // <-- set site_name to level 1
          suburb: suburbVal,
          postcode: postcodeVal,
          state: stateVal,
          country: countryVal,
          lat,
          lng,
          long: lng, // Ensure long is set
          formatted_address: place.formatted_address,
        });
      });
    }
    // Clean up
    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
    // eslint-disable-next-line
  }, [mapLoaded]);

  // Expose resizeMap method to parent
  useImperativeHandle(ref, () => ({
    resizeMap: () => {
      if (window.google && mapInstanceRef.current) {
        window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
        // Optionally, re-center:
        // mapInstanceRef.current.setCenter(marker);
      }
    }
  }));

  return (
    <div>
      <div className="mb-2">
        <input
          id="gmp-place-autocomplete"
          type="text"
          className="w-full border rounded px-2 py-2 mb-2"
          placeholder="Search for an address..."
          value={address}
          onChange={e => setAddress(e.target.value)}
          autoComplete="off"
        />

        {/* <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="w-1/3 border rounded px-2 py-2"
            placeholder="Street Number"
            value={streetNumber}
            readOnly
          />
          <input
            type="text"
            className="w-2/3 border rounded px-2 py-2"
            placeholder="Street Name"
            value={streetName}
            readOnly
          />
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="w-1/3 border rounded px-2 py-2"
            placeholder="Suburb"
            value={suburb}
            readOnly
          />
          <input
            type="text"
            className="w-1/3 border rounded px-2 py-2"
            placeholder="State"
            value={state}
            readOnly
          />
          <input
            type="text"
            className="w-1/3 border rounded px-2 py-2"
            placeholder="Postcode"
            value={postcode}
            readOnly
          />
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="w-full border rounded px-2 py-2"
            placeholder="Country"
            value={country}
            readOnly
          />
        </div> */}

      </div>



      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', borderRadius: 8, border: '1px solid #ddd' }}
      />

        {/* <input
          id="gmp-place-autocomplete"
          type="text"
          className="w-full border rounded px-2 py-2 mb-2"
          placeholder="Search for an address..."
          value={address}
          onChange={e => setAddress(e.target.value)}
          autoComplete="off"
        /> */}

      {/* <div className="text-xs text-zinc-500 mt-2">
        Click on the map to set the pin if the address is not found.<br />
        <span className="text-amber-700">Debug: Map ID in use: <code>{import.meta.env.VITE_GOOGLE_MAP_ID}</code></span>
      </div> */}


    </div>
  );
});

export default GoogleAddressMapInput;
