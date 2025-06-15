import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function AdminPermissions() {
  const { permissions = [] } = usePage().props as any;
  const [newPermission, setNewPermission] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editPermission, setEditPermission] = useState<any>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    router.post(
      '/admin/permissions',
      { name: newPermission, description: newDescription },
      {
        onSuccess: () => {
          setSuccessMessage('Permission added successfully.');
          setNewPermission('');
          setNewDescription('');
        },
        onError: (errors: any) => {
          setErrorMessage(errors?.name || 'Failed to add permission.');
        },
        preserveScroll: true,
      }
    );
  };

  const openEditPanel = (perm: any) => {
    setEditPermission(perm);
    setEditDescription(perm.description || '');
    setEditError('');
    setEditSuccess('');
    setEditOpen(true);
  };
  const closeEditPanel = () => {
    setEditPermission(null);
    setEditDescription('');
    setEditError('');
    setEditSuccess('');
    setEditOpen(false);
  };
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    if (!editPermission) return;
    router.post(
      `/admin/permissions/${editPermission.id}/update-description`,
      { description: editDescription },
      {
        onSuccess: () => {
          setEditSuccess('Description updated.');
          setTimeout(closeEditPanel, 800);
        },
        onError: (errors: any) => {
          setEditError(errors?.description || 'Failed to update description.');
        },
        preserveScroll: true,
      }
    );
  };

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Permissions', href: '/admin/permissions' }]} />
        <Head title="Permissions Management" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Permissions Management</h1>
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{errorMessage}</div>
          )}
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <Input
              value={newPermission}
              onChange={e => setNewPermission(e.target.value)}
              placeholder="New permission name"
              required
            />
            <Input
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Description/Notes (optional)"
            />
            <Button type="submit">Add Permission</Button>
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Permission</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Roles</th>
                </tr>
              </thead>
              <tbody>
                {permissions.length === 0 && (
                  <tr><td className="text-center py-4 text-gray-500" colSpan={3}>No permissions found.</td></tr>
                )}
                {permissions.map((perm: any) => (
                  <tr
                    key={perm.id}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                    onClick={() => openEditPanel(perm)}
                  >
                    <td className="px-4 py-2">{perm.name}</td>
                    <td className="px-4 py-2">{perm.description || ''}</td>
                    <td className="px-4 py-2">{perm.roles?.map((r: any) => r.name).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminContent>

      {/* Edit Description Sheet/Panel */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        {/* Overlay: use white with 30% opacity for better visibility */}
        <div className="fixed inset-0 bg-white bg-opacity-30 z-40 transition-opacity" style={{ display: editOpen ? 'block' : 'none' }} />
        <SheetContent side="right" className="max-w-md w-full z-50 p-6">
          <SheetHeader>
            <SheetTitle>Edit Permission Description</SheetTitle>
            <SheetDescription>
              <b>{editPermission?.name}</b>
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4 mt-6">
            <label className="text-sm font-medium">Description/Notes</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[160px] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Description/Notes"
              autoFocus
            />
            {editError && <div className="text-red-600 text-sm">{editError}</div>}
            {editSuccess && <div className="text-green-700 text-sm">{editSuccess}</div>}
            <div className="flex gap-2 mt-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={closeEditPanel}>Cancel</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
