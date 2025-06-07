import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

export default function WizardStep8PreviewSubmit({
  data,
  media = [],
  propertyTypes = [],
  listingMethods = [],
  listingStatuses = [],
  categoryGroups = [],
  featureGroups = [],
  states = [],
  suburbs = [],
  countries = [],
}: any) {
  // Helper functions for lookups
  const getName = (arr: any[], id: any) => {
    const found = arr?.find((x: any) => String(x.id) === String(id));
    return found ? found.name : undefined;
  };
  const getCategoryNames = (ids: any[]) => {
    if (!Array.isArray(ids)) return '';
    // Flatten all category groups for lookup
    const allCategories = (categoryGroups || []).flatMap((g: any) => g.categories.concat(...g.categories.map((c: any) => c.children || [])));
    return ids.map((id: any) => getName(allCategories, id)).filter(Boolean).join(', ');
  };
  const getFeatureNames = (ids: any[]) => {
    if (!Array.isArray(ids)) return '';
    const allFeatures = (featureGroups || []).flatMap((g: any) => g.features);
    return ids.map((id: any) => getName(allFeatures, id)).filter(Boolean).join(', ');
  };
  // Address display helper
  const getAddressString = (address: any, states: any[], suburbs: any[], countries: any[]) => {
    if (!address) return '';
    const country = getName(countries, address.country_id);
    const state = getName(states, address.state_id);
    const suburb = getName(suburbs, address.suburb_id);
    return [address.unit_number, address.street_number, address.street_name, suburb, state, address.postcode, country]
      .filter(Boolean).join(', ');
  };

  // Helper to render a label/value row
  const Row = ({ label, value }: { label: string, value: any }) => (
    <div className="flex gap-2"><b>{label}</b> <span>{value ?? <span className="italic text-zinc-400">None</span>}</span></div>
  );

  // Helper to get the top-level category name for the first selected category
  const getTopLevelCategoryName = (ids: any[]) => {
    if (!Array.isArray(ids) || !ids.length) return '';
    // Find the first selected category object
    const allCategories = (categoryGroups || []).flatMap((g: any) => g.categories.concat(...g.categories.map((c: any) => c.children || [])));
    const selected = allCategories.find((cat: any) => String(cat.id) === String(ids[0]));
    if (!selected) return '';
    // If it has a parent, find the parent; else it's top-level
    if (selected.parent_id) {
      const parent = allCategories.find((cat: any) => String(cat.id) === String(selected.parent_id));
      return parent ? parent.name : '';
    }
    return selected.name;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Listing Preview</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Media Gallery</h3>
        {media.length > 0 ? (
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {media.map((m: any) => (
                <CarouselItem key={m.id}>
                  <img src={m.url} alt="media" className="w-full h-64 object-contain rounded shadow" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-zinc-500 italic">No media uploaded yet.</div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Row label="Top-level Category:" value={getTopLevelCategoryName(data.categories)} />
          <Row label="Address:" value={getAddressString(data.address, states, suburbs, countries)} />
          <Row label="Suburb:" value={getName(suburbs, data.address?.suburb_id) || data.address?.suburb} />
          <Row label="State:" value={getName(states, data.address?.state_id) || data.address?.state} />
          <Row label="Postcode:" value={data.address?.postcode} />
          <Row label="Country:" value={getName(countries, data.address?.country_id) || data.address?.country} />
          <Row label="Title:" value={data.title} />
          <Row label="Description:" value={data.description} />
          <Row label="Beds:" value={data.beds} />
          <Row label="Baths:" value={data.baths} />
          <Row label="Car Parks:" value={data.car_parks} />
          <Row label="Parking Spaces:" value={data.parking_spaces} />
          <Row label="Ensuites:" value={data.ensuites} />
          <Row label="Garage Spaces:" value={data.garage_spaces} />
          <Row label="Land Size:" value={data.land_size ? `${data.land_size} ${data.land_size_unit || ''}` : undefined} />
          <Row label="Building Size:" value={data.building_size ? `${data.building_size} ${data.building_size_unit || ''}` : undefined} />
          <Row label="Property Type:" value={getName(propertyTypes, data.property_type_id)} />
          <Row label="Listing Method:" value={getName(listingMethods, data.listing_method_id)} />
          <Row label="Listing Status:" value={getName(listingStatuses, data.listing_status_id)} />
          <Row label="Categories:" value={Array.isArray(data.categories) ? getCategoryNames(data.categories) : undefined} />
          <Row label="Features:" value={Array.isArray(data.features) ? getFeatureNames(data.features) : undefined} />
          <Row label="Price Type:" value={data.price?.price_type} />
          <Row label="Price Amount:" value={data.price?.amount} />
          <Row label="Price Range Min:" value={data.price?.range_min} />
          <Row label="Price Range Max:" value={data.price?.range_max} />
          <Row label="Price Label:" value={data.price?.label} />
          <Row label="Price Tax:" value={data.price?.tax} />
        </div>
      </div>
    </div>
  );
}
