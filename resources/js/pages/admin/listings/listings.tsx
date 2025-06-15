import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminListings() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Listings Manager', href: '/admin/listings' },
        ]} />
        <Head title="Listings Manager" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Listings Manager</h1>
          <div className="text-gray-600">This is a placeholder for managing property listings (add, edit, publish, etc.).</div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
