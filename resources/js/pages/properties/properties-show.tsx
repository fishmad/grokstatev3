import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function PropertiesShow({ property }: any) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Properties', href: '/properties' },
    { title: property.title, href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={property.title || 'Property Details'} />
      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{property.title}</h1>
          <Button asChild>
            <a href="/properties" className="ml-auto">Back to List</a>
          </Button>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Description</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.description}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Type</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.property_type?.name}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Status</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.listing_status?.name}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Method</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.listing_method?.name}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Categories</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {Array.isArray(property.categories) && property.categories.length > 0
                    ? property.categories.map((cat: any) => cat.name).join(', ')
                    : <span className="italic text-zinc-400">None</span>}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Category IDs</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {Array.isArray(property.categories) && property.categories.length > 0
                    ? property.categories.map((cat: any) => cat.id).join(', ')
                    : <span className="italic text-zinc-400">None</span>}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Suburb</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {property.address?.suburb?.name || property.address?.suburb_name || property.address?.suburb || <span className="italic text-zinc-400">None</span>}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Postcode</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {property.address?.suburb?.postcode || property.address?.postcode || <span className="italic text-zinc-400">None</span>}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Features</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {Array.isArray(property.features) && property.features.length > 0
                    ? property.features.map((f: any) => f.name).join(', ')
                    : <span className="italic text-zinc-400">None</span>}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Address</div>
                <div className="text-zinc-900 dark:text-zinc-100 space-y-1">
                  {property.address ? (
                    <>
                      <div><b>Street Number:</b> {property.address.street_number}</div>
                      <div><b>Street Name:</b> {property.address.street_name}</div>
                      <div><b>Unit Number:</b> {property.address.unit_number}</div>
                      <div><b>Lot Number:</b> {property.address.lot_number}</div>
                      <div><b>Site Name:</b> {property.address.site_name}</div>
                      <div><b>Region Name:</b> {property.address.region_name}</div>
                      <div><b>Suburb:</b> {property.address.suburb?.name || property.address.suburb_name || property.address.suburb}</div>
                      <div><b>State:</b> {property.address.state?.name || property.address.state_name || property.address.state}</div>
                      <div><b>Country:</b> {property.address.country?.name || property.address.country_name || property.address.country}</div>
                      <div><b>Post Code:</b> {property.address.suburb?.postcode || property.address.postcode}</div>
                      <div><b>Latitude:</b> {property.address.lat}</div>
                      <div><b>Longitude:</b> {property.address.long}</div>
                      <div><b>Display on Map:</b> {property.address.display_address_on_map ? 'Yes' : 'No'}</div>
                      <div><b>Display Street View:</b> {property.address.display_street_view ? 'Yes' : 'No'}</div>
                    </>
                  ) : (
                    <span className="italic text-zinc-400">No address provided</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Beds</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.beds}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Baths</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.baths}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Parking Spaces</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.parking_spaces}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Ensuites</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.ensuites}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Garage Spaces</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.garage_spaces}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Land Size</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.land_size} {property.land_size_unit}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Building Size</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.building_size} {property.building_size_unit}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Dynamic Attributes</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {property.dynamic_attributes && typeof property.dynamic_attributes === 'string' ?
                    (() => {
                      try {
                        const parsed = JSON.parse(property.dynamic_attributes);
                        return Object.keys(parsed).length > 0 ? (
                          <ul className="list-disc ml-4">
                            {Object.entries(parsed).map(([key, value]) => (
                              <li key={key}><b>{key}:</b> {String(value)}</li>
                            ))}
                          </ul>
                        ) : <span className="italic text-zinc-400">None</span>;
                      } catch {
                        return <span className="italic text-red-400">Invalid JSON</span>;
                      }
                    })()
                    : property.dynamic_attributes && Object.keys(property.dynamic_attributes).length > 0 ? (
                      <ul className="list-disc ml-4">
                        {Object.entries(property.dynamic_attributes).map(([key, value]) => (
                          <li key={key}><b>{key}:</b> {String(value)}</li>
                        ))}
                      </ul>
                    ) : <span className="italic text-zinc-400">None</span>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button asChild size="sm" variant="secondary">
              <a href={`/properties/${property.id}/edit`}>Edit</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="/properties">Back to List</a>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
