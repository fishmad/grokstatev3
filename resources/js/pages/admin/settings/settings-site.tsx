import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminSiteConfig() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Settings', href: '/admin/settings' },
          { title: 'Site Configuration', href: '/admin/settings/site' },
        ]} />
        <Head title="Site Configuration" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Site Configuration</h1>
          <div className="text-gray-600">This is a placeholder for site configuration settings.</div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
