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
                <div className="text-zinc-900 dark:text-zinc-100">{property.categories?.map((cat: any) => cat.name).join(', ')}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Features</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.features?.map((f: any) => f.name).join(', ')}</div>
              </div>
              <div>
                <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase mb-1">Address</div>
                <div className="text-zinc-900 dark:text-zinc-100">{property.address?.formatted || ''}</div>
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
