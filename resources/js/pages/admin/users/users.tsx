import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminUsers() {
  const { users = { data: [] }, roles = [] } = usePage().props as any;
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!selectedUser || !selectedRole) return;
    router.post(
      '/admin/users/assign-role',
      { user_id: selectedUser.id, role: selectedRole },
      {
        onSuccess: () => {
          setSuccessMessage('Role assigned successfully.');
          setSelectedUser(null);
          setSelectedRole('');
        },
        onError: (errors) => {
          setErrorMessage(errors?.role || 'Failed to assign role.');
        },
        preserveScroll: true,
      }
    );
  };

  // Filter out 'super-admin' from roles for assignment
  const visibleRoles = roles.filter((role: any) => role.name !== 'super-admin');

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Users', href: '/admin/users' }]} />
        <div className="p-6">
          <Head title="User Management" />
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{errorMessage}</div>
          )}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Roles</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.data.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">No users found.</td></tr>
                )}
                {users.data.map((user: any) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.roles?.join(', ')}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" onClick={() => setSelectedUser(user)}>
                        Assign Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedUser && (
            <form onSubmit={handleAssignRole} className="flex gap-2 items-center mb-4">
              <span>Assign role to <b>{selectedUser.name}</b>:</span>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="border rounded px-2 py-1"
                required
              >
                <option value="">Select role</option>
                {visibleRoles.map((role: any) => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
              <Button type="submit" disabled={!selectedRole}>
                Assign
              </Button>
              <Button type="button" variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
            </form>
          )}
        </div>
      </AdminContent>
    </AdminShell>
  );
}
