import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

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
          <Table>
            <TableCaption>A list of your properties.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.data.map((property: any) => (
                <TableRow key={property.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.listing_status?.name}</TableCell>
                  <TableCell>{property.property_type?.name}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="secondary" className="mr-2">
                      <a href={`/properties/${property.id}/edit`}>Edit</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={`/properties/${property.id}`}>View</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          {properties.meta && properties.meta.links && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  {properties.meta.links.map((link: any, idx: number) => (
                    <PaginationItem key={idx}>
                      {link.url ? (
                        <PaginationLink
                          isActive={link.active}
                          aria-current={link.active ? 'page' : undefined}
                        >
                          <Link
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            preserveScroll
                          />
                        </PaginationLink>
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
        </div>
      </div>
    </AppLayout>
  );
}
