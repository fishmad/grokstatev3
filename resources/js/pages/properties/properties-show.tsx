import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/welcome-layout';
import { getImageUrl } from '@/utils/getImageUrl';

export default function PropertiesShow({ property }: any) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Properties', href: '/properties' },
    { title: property.title, href: '#' },
  ];

  // Get images for gallery
  const images = Array.isArray(property.media) && property.media.length > 0
    ? property.media.map((m: any) => getImageUrl(m.url))
    : [];
  const mainImage = images[0] || getImageUrl('media/_coming_soon.svg');

  // Compose address string
  const address = property.address ? [
    property.address.unit_number,
    property.address.street_number,
    property.address.street_name,
    property.address.suburb?.name || property.address.suburb_name || property.address.suburb,
    property.address.state?.name || property.address.state_name || property.address.state,
    property.address.suburb?.postcode || property.address.postcode
  ].filter(Boolean).join(', ') : '';

  // Compose price display
  const price = property.prices && property.prices.length > 0
    ? property.prices.map((p: any) => {
        if (typeof p.display === 'string' && p.display.trim() !== '') return p.display;
        if (typeof p.amount === 'number' || (typeof p.amount === 'string' && p.amount !== ''))
          return `${p.amount}${p.label ? ' ' + p.label : ''}`;
        return 'N/A';
      }).join(' / ')
    : (typeof property.price_display === 'string' ? property.price_display
        : typeof property.price === 'string' ? property.price
        : 'Contact Agent');

  // Accordion state for description
  const [descExpanded, setDescExpanded] = useState(false);
  const descLimit = 1000;
  const desc = property.description || '';
  const isLongDesc = desc.length > descLimit;
  const descPreview = isLongDesc ? desc.slice(0, descLimit) : desc;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={property.title || 'Property Details'} />
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-8">
          {/* Image Gallery */}
          <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative">
            <img
              src={mainImage}
              alt={property.title ? String(property.title) : 'Property'}
              className="object-cover w-full h-full"
              onError={e => { (e.target as HTMLImageElement).src = getImageUrl('media/_coming_soon.svg'); }}
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex gap-2">
                {images.slice(0, 5).map((img: string, idx: number) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-12 h-12 object-cover rounded border border-zinc-300 dark:border-zinc-700 shadow-sm bg-white/80 dark:bg-zinc-900/80"
                    onError={e => { (e.target as HTMLImageElement).src = getImageUrl('media/_coming_soon.svg'); }}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Main Info */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{property.title}</h1>
              <div className="text-lg text-zinc-700 dark:text-zinc-300 mb-1">{address}</div>
              <div className="text-xl font-semibold text-primary mb-2">{price}</div>
              <div className="flex flex-wrap gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{property.property_type?.name}</span>
                <span>• {property.beds} Beds</span>
                <span>• {property.baths} Baths</span>
                <span>• {property.parking_spaces} Parking</span>
                {property.land_size && <span>• {property.land_size} {property.land_size_unit}</span>}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button asChild size="sm" variant="secondary">
                <a href={`/properties/${property.id}/edit`}>Edit</a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="/properties">Back to List</a>
              </Button>
            </div>
          </div>
        </div>
        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Description</div>
              <div className="text-zinc-900 dark:text-zinc-100 whitespace-pre-line">
                {isLongDesc ? (
                  <>
                    {descExpanded ? desc : descPreview + '...'}
                    <button
                      className="ml-2 text-primary underline text-xs font-medium focus:outline-none"
                      onClick={() => setDescExpanded(v => !v)}
                      type="button"
                    >
                      {descExpanded ? 'Show less' : 'Show more'}
                    </button>
                  </>
                ) : (
                  desc
                )}
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
              <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Categories</div>
              <div className="text-zinc-900 dark:text-zinc-100">
                {Array.isArray(property.categories) && property.categories.length > 0
                  ? property.categories.map((cat: any) => cat.name).join(', ')
                  : <span className="italic text-zinc-400">None</span>}
              </div>
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
                            <li key={key}><b>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</b> {String(value)}</li>
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
                        <li key={key}><b>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</b> {String(value)}</li>
                      ))}
                    </ul>
                  ) : <span className="italic text-zinc-400">None</span>
                }
              </div>
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Community Features</div>
              <div className="text-zinc-900 dark:text-zinc-100">
                {Array.isArray(property.community_features)
                  ? (
                    <ul className="list-disc ml-4">
                      {property.community_features.map((feature: string, idx: number) => (
                        <li key={idx}>{feature.trim()}</li>
                      ))}
                    </ul>
                  )
                  : property.community_features && typeof property.community_features === 'string' && property.community_features.includes('||') ? (
                    <ul className="list-disc ml-4">
                      {property.community_features.split('||').map((feature: string, idx: number) => (
                        <li key={idx}>{feature.trim()}</li>
                      ))}
                    </ul>
                  ) : property.community_features ? (
                    <ul className="list-disc ml-4"><li>{property.community_features}</li></ul>
                  ) : (
                    <span className="italic text-zinc-400">None</span>
                  )}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Home Features</div>
              <div className="text-zinc-900 dark:text-zinc-100">
                {Array.isArray(property.home_features)
                  ? (
                    <ul className="list-disc ml-4">
                      {property.home_features.map((feature: string, idx: number) => (
                        <li key={idx}>{feature.trim()}</li>
                      ))}
                    </ul>
                  )
                  : property.home_features && typeof property.home_features === 'string' && property.home_features.includes('||') ? (
                    <ul className="list-disc ml-4">
                      {property.home_features.split('||').map((feature: string, idx: number) => (
                        <li key={idx}>{feature.trim()}</li>
                      ))}
                    </ul>
                  ) : property.home_features ? (
                    <ul className="list-disc ml-4"><li>{property.home_features}</li></ul>
                  ) : (
                    <span className="italic text-zinc-400">None</span>
                  )}
              </div>
            </div>
          </div>
          {/* Address & Details */}
          <div className="space-y-6">
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Full Address</div>
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
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Listing Details</div>
              <div className="text-zinc-900 dark:text-zinc-100">
                <div><b>Status:</b> {property.listing_status?.name}</div>
                <div><b>Method:</b> {property.listing_method?.name}</div>
                <div><b>Authority:</b> {property.listing_authority?.name}</div>
                <div><b>Tenancy:</b> {property.tenancy_type?.name}</div>
                <div><b>Created:</b> {property.created_at}</div>
                <div><b>Updated:</b> {property.updated_at}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
