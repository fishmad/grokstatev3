import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminAuditing() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Settings', href: '/admin/settings' },
          { title: 'Auditing', href: '/admin/settings/auditing' },
        ]} />
        <Head title="Auditing" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Auditing</h1>
          <div className="text-gray-600">This is a placeholder for auditing and activity log settings.</div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
