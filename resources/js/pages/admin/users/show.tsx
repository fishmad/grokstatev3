import React from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { type Property } from '@/types';

export default function ShowUser({ user }: { user: any }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Panel', href: route('admin.index') },
    { title: 'Users', href: route('admin.users.index') },
    { title: user.name, href: '#' },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title={user.name + ' - User Details'} />
      <div className="max-w-xl mx-auto mt-8">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-6">User Details</h1>
            <div className="space-y-4 mb-8">
              <div><span className="font-medium">Name:</span> {user.name}</div>
              <div><span className="font-medium">Email:</span> {user.email}</div>
              <div><span className="font-medium">Phone Number:</span> {user.phone_number}</div>
              <div><span className="font-medium">Role:</span> {user.role}</div>
              <div><span className="font-medium">Company Name:</span> {user.company_name}</div>
              <div><span className="font-medium">Profile Picture:</span> {user.profile_picture ? <img src={user.profile_picture} alt="Profile" className="h-12 w-12 rounded-full inline-block border border-border bg-background" /> : <span className="italic text-muted-foreground">None</span>}</div>
              <div><span className="font-medium">Created:</span> {user.created_at}</div>
              <div><span className="font-medium">Updated:</span> {user.updated_at}</div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Properties</h2>
            {user.properties && user.properties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-md">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-3 py-2 text-left">Title</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Created</th>
                      <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.properties.map((property: Property) => (
                      <tr key={property.id} className="border-b last:border-b-0">
                        <td className="px-3 py-2 font-medium whitespace-nowrap">{property.title}</td>
                        <td className="px-3 py-2 capitalize">{property.status}</td>
                        <td className="px-3 py-2">{property.created_at?.slice(0, 10)}</td>
                        <td className="px-3 py-2">
                          <a
                            href={route('admin.properties.edit', property.id)}
                            className="text-primary underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                            aria-label={`Edit property ${property.title}`}
                          >
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="italic text-muted-foreground">No properties found for this user.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
