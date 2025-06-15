import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function AdminRoles() {
  const { roles = [], permissions = [] } = usePage().props as any;
  const [newRole, setNewRole] = useState('');
  const { data, setData, post, processing, errors, reset } = useForm({ name: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editRole, setEditRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    // Sanitize and lowercase the new role name
    const sanitizedRole = newRole.trim().toLowerCase();
    router.post(
      '/admin/roles',
      { name: sanitizedRole },
      {
        onSuccess: () => {
          setSuccessMessage('Role added successfully.');
          setNewRole('');
          reset();
        },
        onError: (errors: any) => {
          setErrorMessage(errors?.name || 'Failed to add role.');
        },
        preserveScroll: true,
      }
    );
  };

  const handleAssignPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!editRole || selectedPermissions.length === 0) return;
    router.post(
      '/admin/roles/assign-permissions',
      { role_id: editRole.id, permissions: selectedPermissions },
      {
        onSuccess: () => {
          setSuccessMessage('Permissions assigned successfully.');
          setEditRole(null);
          setSelectedPermissions([]);
          setEditOpen(false);
        },
        onError: (errors: any) => {
          setErrorMessage(errors?.permissions || 'Failed to assign permissions.');
        },
        preserveScroll: true,
      }
    );
  };

  // Filter out 'super-admin' from roles for assignment and display
  const visibleRoles = roles.filter((role: any) => role.name !== 'super-admin');

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Roles', href: '/admin/roles' }]} />
        <Head title="Roles Management" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Roles Management</h1>
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <Input
              value={newRole}
              onChange={e => setNewRole(e.target.value.toLowerCase())}
              placeholder="New role name"
              required
            />
            <Button type="submit" disabled={processing}>Add Role</Button>
          </form>
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{errorMessage}</div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 && (
                  <tr><td className="text-center py-4 text-gray-500" colSpan={2}>No roles found.</td></tr>
                )}
                {roles.filter((role: any) => role.name !== 'super-admin').map((role: any) => (
                  <tr
                    key={role.id}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      setEditRole(role);
                      setSelectedPermissions(role.permissions?.map((p: any) => p.name) || []);
                      setEditOpen(true);
                    }}
                  >
                    <td className="px-4 py-2">{role.name.replace(/\b\w/g, (l: string) => l.toUpperCase())}</td>
                    <td className="px-4 py-2">{role.permissions?.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((p: any) => p.name).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminContent>

      {/* Assign Permissions Sheet/Panel */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        {/* Overlay: use white with 30% opacity for better visibility */}
        <div className="fixed inset-0 bg-white bg-opacity-30 z-40 transition-opacity" style={{ display: editOpen ? 'block' : 'none' }} />
        <SheetContent side="right" className="max-w-md w-full z-50 p-6">
          <SheetHeader>
            <SheetTitle>Assign Permissions</SheetTitle>
            <SheetDescription>
              <b>{editRole?.name && editRole.name.replace(/\b\w/g, (l: string) => l.toUpperCase())}</b>
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleAssignPermissions} className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm: any) => (
                <label key={perm.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.name)}
                    onChange={e => {
                      if (e.target.checked) setSelectedPermissions([...selectedPermissions, perm.name]);
                      else setSelectedPermissions(selectedPermissions.filter(p => p !== perm.name));
                    }}
                  />
                  {perm.name}
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={selectedPermissions.length === 0}>Assign</Button>
              <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setSelectedPermissions([]); }}>Cancel</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
