import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminAgents() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Agent Management', href: '/admin/agents' },
        ]} />
        <Head title="Agent Management" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Agent Management</h1>
          <div className="text-gray-600">This is a placeholder for managing agents (add, edit, assign properties, etc.).</div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
