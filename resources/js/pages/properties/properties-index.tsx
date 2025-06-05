import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
    filters: { search?: string; property_type_id?: string; country_id?: string; state_id?: string; suburb_id?: string; price_min?: number; price_max?: number };
    countries: any[];
    states: any[];
    suburbs: any[];
    propertyTypes: any[];
}

export default function PropertiesIndex({ properties, filters, countries, states: initialStates, suburbs: initialSuburbs, propertyTypes }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [propertyTypeId, setPropertyTypeId] = useState(filters.property_type_id || '');
    const [countryId, setCountryId] = useState(filters.country_id || '');
    const [stateId, setStateId] = useState(filters.state_id || '');
    const [suburbId, setSuburbId] = useState(filters.suburb_id || '');
    const [priceMin, setPriceMin] = useState(filters.price_min || '');
    const [priceMax, setPriceMax] = useState(filters.price_max || '');
    const [sort, setSort] = useState('');
    const [states, setStates] = useState<any[]>(initialStates || []);
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
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search properties..."
                        className="border p-2 rounded"
                    />
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
                    </select>
                </div>
                <button
                    onClick={() => applyFilters({ search, property_type_id: propertyTypeId, country_id: countryId, state_id: stateId, suburb_id: suburbId, price_min: priceMin, price_max: priceMax })}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Apply Filters
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.data.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No properties found.</div>
                    )}
                    {properties.data.map((property) => (
                        <div key={property.id} className="border p-4 rounded">
                            <h2 className="text-xl font-semibold">{property.title}</h2>
                            <p>{property.description}</p>
                            <p className="font-bold">{property.price?.display_price || 'Price not available'}</p>
                            <p>
                                {property.address?.street_number} {property.address?.street_name},
                                {property.address?.suburb?.name ? ` ${property.address.suburb.name},` : ''}
                                {property.address?.suburb?.state?.name ? ` ${property.address.suburb.state.name},` : ''}
                                {property.address?.suburb?.state?.country?.name ? ` ${property.address.suburb.state.country.name},` : ''}
                                {property.address?.suburb?.postcode ? ` ${property.address.suburb.postcode}` : ''}
                            </p>
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
