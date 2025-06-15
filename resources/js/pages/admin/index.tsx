import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';

export default function AdminIndex() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[{ title: 'Admin', href: '/admin' }]} />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Home</h1>
          {/* ...rest of the content... */}
        </div>
      </AdminContent>
    </AdminShell>
  );
}

// Move property-related admin views into the properties folder
// Move payment-related admin views into the payments folder
// Update all imports in admin to reflect new locations