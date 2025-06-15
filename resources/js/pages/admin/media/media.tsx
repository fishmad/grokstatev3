import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminMediaLibrary() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Media Library', href: '/admin/media' },
        ]} />
        <Head title="Media Library" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Media Library</h1>
          <div className="text-gray-600">This is a placeholder for managing uploaded images, videos, and other media. (Will reference the media DB table.)</div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
