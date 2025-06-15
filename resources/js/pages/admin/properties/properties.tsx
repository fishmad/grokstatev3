import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function AdminProperties() {
	const { properties, success } = usePage().props as any;

	return (
		<AdminShell variant="sidebar">
			<AdminSidebar />
			<AdminContent variant="sidebar">
				<AdminSidebarHeader breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Properties', href: '/admin/properties' }]} />
				<Head title="Properties Management" />
				<div className="p-6">
					<h1 className="text-2xl font-bold mb-4">Properties Management</h1>
					{success && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{success}</div>}
					<div className="mb-4 flex justify-end">
						<Button onClick={() => router.get('/admin/properties/create')}>Add Property</Button>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th className="px-4 py-2 text-left">ID</th>
									<th className="px-4 py-2 text-left">Status</th>
									<th className="px-4 py-2 text-left">Type</th>
									<th className="px-4 py-2 text-left">Price</th>
									<th className="px-4 py-2 text-left">Created</th>
									<th className="px-4 py-2 text-left">Actions</th>
								</tr>
							</thead>
							<tbody>
								{properties.data.length === 0 && (
									<tr>
										<td className="text-center py-4 text-gray-500" colSpan={6}>
											No properties found.
										</td>
									</tr>
								)}
								{properties.data.map((property: any) => (
									<tr key={property.id} className="border-b hover:bg-blue-50">
										<td className="px-4 py-2">{property.id}</td>
										<td className="px-4 py-2">{property.status}</td>
										<td className="px-4 py-2">{property.type?.name || '-'}</td>
										<td className="px-4 py-2">{property.price ? `$${property.price.toLocaleString()}` : '-'}</td>
										<td className="px-4 py-2">{property.created_at ? new Date(property.created_at).toLocaleDateString() : '-'}</td>
										<td className="px-4 py-2 flex gap-2">
											<Button size="sm" variant="outline" onClick={() => router.get(`/admin/properties/${property.id}`)}>
												Preview
											</Button>
											<Button size="sm" variant="outline" onClick={() => router.get(`/admin/properties/${property.id}/edit`)}>
												Edit
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</AdminContent>
		</AdminShell>
	);
}
