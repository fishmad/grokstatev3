import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Properties', href: '/properties' },
];

export default function PropertiesIndex({ properties }: any) {
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
        <div className="overflow-x-auto rounded-lg shadow border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800 hidden sm:table-header-group">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
              {properties.data.map((property: any) => (
                <tr key={property.id} className="sm:table-row flex flex-col sm:flex-row sm:table-row w-full sm:w-auto border-b sm:border-0">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100 flex-1">
                    <span className="sm:hidden font-semibold text-zinc-500 dark:text-zinc-400">Title: </span>{property.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                    <span className="sm:hidden font-semibold text-zinc-500 dark:text-zinc-400">Status: </span>{property.listing_status?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                    <span className="sm:hidden font-semibold text-zinc-500 dark:text-zinc-400">Type: </span>{property.property_type?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex-1 flex sm:block gap-2 sm:gap-0 justify-end">
                    <Button asChild size="sm" variant="secondary" className="mr-2">
                      <a href={`/properties/${property.id}/edit`}>Edit</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={`/properties/${property.id}`}>View</a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {properties.meta && properties.meta.links && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {properties.meta.links.map((link: any, idx: number) => (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  className={`px-3 py-1 border text-sm rounded-md mx-0.5 transition-colors duration-150
                    ${link.active ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-400 dark:text-zinc-900 dark:border-blue-400' :
                    'bg-white text-blue-600 border-zinc-300 hover:bg-blue-50 dark:bg-zinc-900 dark:text-blue-400 dark:border-zinc-700 dark:hover:bg-zinc-800'}
                    ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  aria-current={link.active ? 'page' : undefined}
                  preserveScroll
                />
              ))}
            </nav>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
