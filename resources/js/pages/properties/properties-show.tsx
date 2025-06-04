import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Properties', href: '/properties' },
  { title: 'Show', href: '#' },
];

export default function PropertiesShow({ property }: any) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={property.title} />
      <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
        <p className="mb-2">{property.description}</p>
        <div className="mb-2">
          <strong>Type:</strong> {property.property_type?.name}
        </div>
        <div className="mb-2">
          <strong>Status:</strong> {property.listing_status?.name}
        </div>
        <div className="mb-2">
          <strong>Method:</strong> {property.listing_method?.name}
        </div>
        <div className="mb-2">
          <strong>Categories:</strong> {property.categories?.map((c: any) => c.name).join(', ')}
        </div>
        <div className="mb-2">
          <strong>Features:</strong> {property.features?.map((f: any) => f.name).join(', ')}
        </div>
        <div className="mb-2">
          <strong>Address:</strong> {property.address?.street_name}, {property.address?.suburb}, {property.address?.state}
        </div>
        <div className="flex gap-2 mt-4">
          <Link href={`/properties/${property.id}/edit`} className="btn btn-secondary">Edit</Link>
          <Link href="/properties" className="btn btn-outline">Back to List</Link>
        </div>
      </div>
    </AppLayout>
  );
}
