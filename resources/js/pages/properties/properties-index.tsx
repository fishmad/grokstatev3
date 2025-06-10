import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/welcome-layout';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface Props {
    properties: any; // Accept any paginator structure
    filters: { search?: string; property_type_id?: string; country_id?: string; state_id?: string; suburb_id?: string; price_min?: number; price_max?: number; listing_method_id?: string; listing_status_id?: string };
    countries: any[];
    states: any[];
    suburbs: any[];
    propertyTypes: any[];
    listingMethods: any[]; // <-- add this prop
    listingStatuses: any[]; // <-- add this prop for listing status
}

export default function PropertiesIndex({ properties, filters, countries, states: initialStates, suburbs: initialSuburbs, propertyTypes, listingMethods, listingStatuses }: Props) {
    // Find Australia country ID
    const australia = countries.find((c) => c.name === 'Australia');
    // Default to Australia if not set in filters
    const defaultCountryId = filters.country_id || (australia ? australia.id : '');
    // Only show states for Australia by default
    const australianStates = (initialStates || []).filter((s: any) => s.country_id === (australia ? australia.id : ''));

    const [search, setSearch] = useState(filters.search || '');
    const [countryId, setCountryId] = useState(defaultCountryId);
    const [stateId, setStateId] = useState(filters.state_id || '');
    const [suburbId, setSuburbId] = useState(filters.suburb_id || '');
    const [priceMin, setPriceMin] = useState(filters.price_min || '');
    const [priceMax, setPriceMax] = useState(filters.price_max || '');
    const [sort, setSort] = useState('');
    const [listingMethodId, setListingMethodId] = useState(filters.listing_method_id || '');
    // Add missing state for propertyTypeId
    const [propertyTypeId, setPropertyTypeId] = useState(filters.property_type_id || '');
    const [listingStatusId, setListingStatusId] = useState(filters.listing_status_id || '');
    // Set initial states to Australian states if country is Australia, else initialStates
    const [states, setStates] = useState<any[]>(defaultCountryId === (australia ? australia.id : '') ? australianStates : (initialStates || []));
    const [suburbs, setSuburbs] = useState<any[]>(initialSuburbs || []);

    const applyFilters = (newFilters: any) => {
        // Convert empty string values to undefined for backend filtering
        const cleanedFilters: Record<string, any> = {};
        Object.entries({ ...filters, ...newFilters, sort }).forEach(([k, v]) => {
            cleanedFilters[k] = v === '' ? undefined : v;
        });
        router.visit(route('properties.index'), {
            method: 'get',
            data: cleanedFilters,
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (countryId) {
            fetch(`/api/states/${countryId}`)
                .then(res => res.json())
                .then((states) => {
                    setStates(states);
                    setStateId('');
                    setSuburbId('');
                });
        }
    }, [countryId]);

    useEffect(() => {
        if (stateId) {
            fetch(`/api/suburbs/${stateId}`)
                .then(res => res.json())
                .then((suburbs) => {
                    setSuburbs(suburbs);
                    setSuburbId('');
                });
        }
    }, [stateId]);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Properties', href: '/properties' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Properties" />
      <div className="w-full max-w-full px-6 sm:px-6 md:px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Properties</h1>
          <Button asChild>
            <a href="/properties/create" className="ml-auto">Add Property</a>
          </Button>
        </div>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Properties</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search properties..."
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select value={propertyTypeId} onChange={(e) => setPropertyTypeId(e.target.value)} className="border p-2 rounded">
                        <option value="">All Property Types</option>
                        {propertyTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                    <select value={countryId} onChange={(e) => setCountryId(e.target.value)} className="border p-2 rounded">
                        <option value="">All Countries</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                    </select>
                    <select value={stateId} onChange={(e) => setStateId(e.target.value)} className="border p-2 rounded">
                        <option value="">All States</option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select value={suburbId} onChange={(e) => setSuburbId(e.target.value)} className="border p-2 rounded">
                        <option value="">All Suburbs</option>
                        {suburbs.map((suburb) => (
                            <option key={suburb.id} value={suburb.id}>{suburb.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        placeholder="Min Price"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        placeholder="Max Price"
                        className="border p-2 rounded"
                    />
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
                        <option value="">Sort By</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A-Z</option>
                        <option value="name_desc">Name: Z-A</option>
                        <option value="created_at_desc">Date Added: Newest</option>
                        <option value="created_at_asc">Date Added: Oldest</option>
                        <option value="updated_at_desc">Date Modified: Newest</option>
                        <option value="updated_at_asc">Date Modified: Oldest</option>
                    </select>
                    <select value={listingMethodId} onChange={(e) => setListingMethodId(e.target.value)} className="border p-2 rounded">
                        <option value="">All Listing Methods</option>
                        {(listingMethods || []).map((method: any) => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                    </select>
                    <select value={listingStatusId} onChange={(e) => setListingStatusId(e.target.value)} className="border p-2 rounded">
                        <option value="">All Listing Statuses</option>
                        {(listingStatuses || []).map((status: any) => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => applyFilters({ search, property_type_id: propertyTypeId, country_id: countryId, state_id: stateId, suburb_id: suburbId, price_min: priceMin, price_max: priceMax, listing_method_id: listingMethodId, listing_status_id: listingStatusId, sort })}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Apply Filters
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.data.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No properties found.</div>
                    )}
                    {properties.data.map((property: any) => (
                        <div key={property.id} className="border p-4 rounded">
                          <img
    src={property.media && property.media.length > 0 && property.media[0].url
      ? (property.media[0].url.startsWith('http') ? property.media[0].url : `/storage/${property.media[0].url}`)
      : '/storage/media/_coming_soon.svg'}
    alt={
      property.media && property.media.length > 0 && property.media[0].alt
        ? String(property.media[0].alt)
        : (property.title || 'Property photo')
    }
    className="w-full h-48 object-cover rounded mb-2 border border-gray-200 bg-gray-100"
    loading="lazy"
    style={{ objectFit: 'cover', background: '#f3f4f6' }}
/>
{property.media && property.media.length > 0 && (
  <div className="text-xs text-gray-500 mb-2">Photo url: <code>{property.media[0].url}</code></div>
)}

                            <h2 className="text-xl font-semibold">{property.title}</h2>
                            <p style={{ whiteSpace: 'pre-line' }}>{property.description && property.description.length > 500
                                ? `${property.description.slice(0, 500)}...more`
                                : property.description}
                            </p>
                            <p className="font-bold">
                              {property.price?.display_price
                                ?? (property.price?.amount ? `$${Number(property.price.amount).toLocaleString()}` : 'Price not available')}
                              {property.price?.price_type ? (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({property.price.price_type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())})
                                </span>
                              ) : null}
                            </p>
                            <p>
                                {property.address?.street_number} {property.address?.street_name},
                                {property.address?.suburb?.name ? ` ${property.address.suburb.name},` : ''}
                                {property.address?.suburb?.state?.name ? ` ${property.address.suburb.state.name},` : ''}
                                {property.address?.suburb?.state?.country?.name ? ` ${property.address.suburb.state.country.name},` : ''}
                                {property.address?.suburb?.postcode ? ` ${property.address.suburb.postcode}` : ''}
                            </p>
                            {/* Only show if at least one value is present */}
                            {(property.beds ?? property.baths ?? property.parking_spaces ?? property.land_size ?? property.building_size) ? (
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                                {property.beds != null && property.beds !== '' && property.beds !== '-' ? <div><strong>Beds:</strong> {property.beds}</div> : null}
                                {property.baths != null && property.baths !== '' && property.baths !== '-' ? <div><strong>Baths:</strong> {property.baths}</div> : null}
                                {property.parking_spaces != null && property.parking_spaces !== '' && property.parking_spaces !== '-' ? <div><strong>Parking:</strong> {property.parking_spaces}</div> : null}
                                {property.land_size ? <div><strong>Land Size:</strong> {`${property.land_size} ${property.land_size_unit || ''}`}</div> : null}
                                {property.building_size ? <div><strong>Building Size:</strong> {`${property.building_size} ${property.building_size_unit || ''}`}</div> : null}
                              </div>
                            ) : null}
                            <div className="text-sm text-gray-700 mt-2">
                              <strong>Listing Status:</strong> {property.listing_status?.name || '-'}<br />
                              <strong>Listing Method:</strong> {property.listing_method?.name || '-'}<br />
                              <strong>Property Type:</strong> {property.property_type?.name || '-'}
                            </div>
                            <div className="text-sm text-gray-700 mt-2">
                              <strong>Categories:</strong> {Array.isArray(property.categories) && property.categories.length > 0
                                ? property.categories.map((cat: any) => cat.name).join(', ')
                                : 'None'}
                            </div>
                            <Link href={route('properties.show', property.id)} className="text-blue-500">View Details</Link>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls (single, robust Inertia version) */}
                {(properties.links && properties.links.length > 1) && (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        {properties.links.map((link: any, idx: number) => (
                          <PaginationItem key={idx}>
                            {link.url ? (
                              <button
                                type="button"
                                disabled={!link.url || link.active}
                                className={`px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-current={link.active ? 'page' : undefined}
                                onClick={() => {
                                  if (!link.active && link.url) {
                                    router.visit(link.url, {
                                      preserveScroll: true,
                                      preserveState: true,
                                    });
                                  }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                              />
                            ) : (
                              <span
                                className="pointer-events-none opacity-50 px-3 py-1"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                              />
                            )}
                          </PaginationItem>
                        ))}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
            </div></div>
        </AppLayout>
    );
}
