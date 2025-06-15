import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminPaymentsConfig() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Payments Config', href: '/admin/payments-config' },
        ]} />
        <Head title="Payments Configuration" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Payments Configuration</h1>
          <div className="text-gray-600">This is a placeholder for managing payment gateway settings, plans, and related configuration.</div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
