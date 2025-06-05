```tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Address {
  street_number?: string;
  street_name?: string;
  unit_number?: string;
  suburb?: string;
  state?: string;
  country?: string;
  postcode?: string;
  lat?: string;
  long?: string;
  country_id?: number;
  state_id?: number;
  suburb_id?: number;
}

interface AddressAutofillProps {
  onSelect: (address: Address) => void;
  defaultValue?: Partial<Address>;
}

export default function AddressAutofill({ onSelect, defaultValue }: AddressAutofillProps) {
  const [query, setQuery] = useState<string>(
    defaultValue
      ? `${defaultValue.street_number || ''} ${defaultValue.street_name || ''}, ${defaultValue.suburb || ''}, ${defaultValue.state || ''}, ${defaultValue.country || ''}`
      : ''
  );
  const [debouncedQuery] = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<Partial<Address>>(defaultValue || {});
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps API
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '', // Set in .env
      libraries: ['places'],
    });

    loader.load().then(() => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(divRef.current!);
    }).catch((err) => {
      setError('Failed to load Google Maps API');
      console.error(err);
    });

    return () => {
      autocompleteService.current = null;
      placesService.current = null;
    };
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (!autocompleteService.current || debouncedQuery.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input: debouncedQuery, types: ['address'] },
      (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setSuggestions([]);
          setIsOpen(false);
          return;
        }

        setSuggestions(
          predictions.map((pred) => ({
            street_name: pred.description, // Placeholder, will fetch details on select
            place_id: pred.place_id,
          }))
        );
        setIsOpen(true);
      }
    );
  }, [debouncedQuery]);

  const handleSelect = async (address: Address) => {
    setError(null);

    if (!address.place_id && !placesService.current) {
      // Manual address or no PlacesService
      try {
        const response = await fetch('/resolve-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({
            country: address.country || '',
            state: address.state || '',
            suburb: address.suburb || '',
            postcode: address.postcode || '',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to resolve location');
        }

        const data = await response.json();
        const resolvedAddress: Address = {
          ...address,
          country_id: data.country_id,
          state_id: data.state_id,
          suburb_id: data.suburb_id,
        };

        onSelect(resolvedAddress);
        setQuery(
          `${resolvedAddress.street_number || ''} ${resolvedAddress.street_name || ''}, ${resolvedAddress.suburb || ''}, ${resolvedAddress.state || ''}, ${resolvedAddress.country || ''}`
        );
        setIsOpen(false);
        setManualAddress(resolvedAddress);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      return;
    }

    // Fetch place details for Google Places selection
    placesService.current!.getDetails(
      { placeId: address.place_id!, fields: ['address_components', 'geometry'] },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          setError('Failed to fetch place details');
          setIsOpen(false);
          return;
        }

        const get = (type: string) => {
          const comp = place.address_components?.find((c) => c.types.includes(type));
          return comp ? comp.long_name : '';
        };

        const selectedAddress: Address = {
          street_number: get('street_number'),
          street_name: get('route'),
          unit_number: get('subpremise') || '',
          suburb: get('locality') || get('sublocality') || get('postal_town') || '',
          state: get('administrative_area_level_1') || '',
          country: get('country') || '',
          postcode: get('postal_code') || '',
          lat: place.geometry?.location?.lat().toString() || '',
          long: place.geometry?.location?.lng().toString() || '',
        };

        // Resolve with /resolve-location
        fetch('/resolve-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({
            country: selectedAddress.country,
            state: selectedAddress.state,
            suburb: selectedAddress.suburb,
            postcode: selectedAddress.postcode,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to resolve location');
            }
            return response.json();
          })
          .then((data) => {
            const resolvedAddress: Address = {
              ...selectedAddress,
              country_id: data.country_id,
              state_id: data.state_id,
              suburb_id: data.suburb_id,
            };
            onSelect(resolvedAddress);
            setQuery(
              `${resolvedAddress.street_number || ''} ${resolvedAddress.street_name || ''}, ${resolvedAddress.suburb || ''}, ${resolvedAddress.state || ''}, ${resolvedAddress.country || ''}`
            );
            setIsOpen(false);
            setManualAddress(resolvedAddress);
          })
          .catch((err) => {
            setError(err.message || 'An error occurred');
            setIsOpen(false);
          });
      }
    );
  };

  const handleManualSubmit = async () => {
    await handleSelect(manualAddress as Address);
  };

  return (
    <div className="space-y-4">
      <div className="relative" ref={divRef}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Input
              type="text"
              placeholder="Start typing address (e.g., 123 Main St, Sydney, NSW, Australia)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn('w-full', error && 'border-red-500')}
            />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
            {suggestions.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSelect(suggestion)}
                  >
                    {suggestion.street_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No suggestions found</div>
            )}
          </PopoverContent>
        </Popover>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Manual input fallback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Street Number"
          value={manualAddress.street_number || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, street_number: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Street Name"
          value={manualAddress.street_name || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, street_name: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Unit Number (optional)"
          value={manualAddress.unit_number || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, unit_number: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Suburb"
          value={manualAddress.suburb || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, suburb: e.target.value })}
        />
        <Input
          type="text"
          placeholder="State"
          value={manualAddress.state || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, state: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Country"
          value={manualAddress.country || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, country: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Postcode"
          value={manualAddress.postcode || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, postcode: e.target.value })}
        />
        <Input
          type="number"
          step="0.00000001"
          placeholder="Latitude (optional)"
          value={manualAddress.lat || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, lat: e.target.value })}
        />
        <Input
          type="number"
          step="0.00000001"
          placeholder="Longitude (optional)"
          value={manualAddress.long || ''}
          onChange={(e) => setManualAddress({ ...manualAddress, long: e.target.value })}
        />
      </div>
      <Button type="button" onClick={handleManualSubmit}>Resolve Address</Button>
    </div>
  );
}
```