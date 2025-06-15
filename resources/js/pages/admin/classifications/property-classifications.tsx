import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function AdminPropertyClassification() {
  const { classifications = [] } = usePage().props as any;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [error, setError] = useState('');
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', slug: '', description: '' });
  const [editError, setEditError] = useState('');
  const [editClassification, setEditClassification] = useState<any>(null);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    router.post('/admin/property-classifications', form, {
      onSuccess: () => {
        setForm({ name: '', slug: '', description: '' });
        setShowForm(false);
      },
      onError: (errors: any) => setError(errors?.name || 'Failed to create classification.'),
    });
  };

  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e: any) => {
    e.preventDefault();
    setEditError('');
    router.put(`/admin/property-classifications/${editClassification.id}`, editForm, {
      onSuccess: () => {
        setEditSheetOpen(false);
        setEditClassification(null);
      },
      onError: (errors: any) => setEditError(errors?.name || 'Failed to update classification.'),
    });
  };

  const handleDelete = () => {
    if (!editClassification) return;
    if (confirm('Are you sure you want to delete this classification?')) {
      router.delete(`/admin/property-classifications/${editClassification.id}`, {
        onSuccess: () => {
          setEditSheetOpen(false);
          setEditClassification(null);
        },
      });
    }
  };

  const handleRowClick = (classification: any) => {
    setEditClassification(classification);
    setEditForm({
      name: classification.name,
      slug: classification.slug,
      description: classification.description,
    });
    setEditSheetOpen(true);
  };

  const handleCreateChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    router.post('/admin/property-classifications', form, {
      onSuccess: () => {
        setForm({ name: '', slug: '', description: '' });
        setCreateSheetOpen(false);
      },
      onError: (errors: any) => setError(errors?.name || 'Failed to create classification.'),
    });
  };

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Property Classifications', href: '/admin/property-classifications' },
        ]} />
        <Head title="Property Classifications" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h1 className="text-2xl font-bold">Property Classifications</h1>
            <div className="md:ml-4">
              <Button onClick={() => setCreateSheetOpen(true)}>{showForm ? 'Cancel' : 'Add Classification'}</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Classes</th>
                </tr>
              </thead>
              <tbody>
                {classifications.length === 0 && (
                  <tr><td className="text-center py-4 text-gray-500" colSpan={4}>No classifications found.</td></tr>
                )}
                {classifications.map((classification: any) => (
                  <tr
                    key={classification.id}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                    tabIndex={0}
                    onClick={() => handleRowClick(classification)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(classification); }}
                    aria-label={`Edit classification ${classification.name}`}
                  >
                    <td className="px-4 py-2 font-semibold">{classification.name}</td>
                    <td className="px-4 py-2">{classification.slug}</td>
                    <td className="px-4 py-2">{classification.description}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); router.get(`/admin/property-classifications/${classification.id}/classes`); }}>View Classes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent aria-describedby="edit-classification-desc">
            <SheetHeader>
              <SheetTitle>Edit Classification</SheetTitle>
            </SheetHeader>
            <div id="edit-classification-desc" className="sr-only">Edit the selected property classification details.</div>
            {editClassification && (
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-3 mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                <label className="font-medium">Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <label className="font-medium">Slug</label>
                <input
                  name="slug"
                  value={editForm.slug}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <label className="font-medium">Description</label>
                <input
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2"
                />
                {editError && <div className="text-red-600 text-sm">{editError}</div>}
                <div className="flex gap-2 mt-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
              </form>
            )}
          </SheetContent>
        </Sheet>
        <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetContent aria-describedby="create-classification-desc">
            <SheetHeader>
              <SheetTitle>Add Classification</SheetTitle>
            </SheetHeader>
            <div id="create-classification-desc" className="sr-only">Create a new property classification.</div>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3 mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
              <label className="font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleCreateChange}
                className="border rounded px-3 py-2"
                required
              />
              <label className="font-medium">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleCreateChange}
                className="border rounded px-3 py-2"
                required
              />
              <label className="font-medium">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleCreateChange}
                className="border rounded px-3 py-2"
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex gap-2 mt-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => setCreateSheetOpen(false)}>Cancel</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </AdminContent>
    </AdminShell>
  );
}
