import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Properties', href: '/properties' },
];

export default function PropertiesIndex({ properties }: any) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Properties" />
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <Link href="/properties/create" className="btn btn-primary">Add Property</Link>
        </div>
        <table className="table w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {properties.data.map((property: any) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>{property.listing_status?.name}</td>
                <td>{property.property_type?.name}</td>
                <td>
                  <Link href={`/properties/${property.id}/edit`} className="btn btn-sm btn-secondary mr-2">Edit</Link>
                  <Link href={`/properties/${property.id}`} className="btn btn-sm btn-outline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
