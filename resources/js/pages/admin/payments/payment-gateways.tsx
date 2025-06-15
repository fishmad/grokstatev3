import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

export default function AdminPaymentGateways() {
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Payment Gateways', href: '/admin/payment-gateways' },
        ]} />
        <Head title="Payment Gateways" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Payment Gateways</h1>
          <div className="text-gray-600">This is a placeholder for managing payment gateway settings, plans, and related configuration.</div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Gateways</h2>
            <ul className="list-disc ml-6">
              <li>
                <a href="/admin/payment-gateways/stripe" className="text-blue-700 underline hover:text-blue-900">Stripe</a> — Configure and test Stripe integration
              </li>
              <li className="text-gray-400">PayPal (coming soon)</li>
            </ul>
          </div>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
