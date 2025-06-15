import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';

export default function AdminPropertySubclasses() {
  const { propertyClass, subclasses = [], classification } = usePage().props as any;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [error, setError] = useState('');
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editSubclass, setEditSubclass] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', description: '' });
  const [editError, setEditError] = useState('');
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    router.post(`/admin/property-classifications/${classification.id}/classes/${propertyClass.id}/subclasses`, form, {
      onSuccess: () => {
        setForm({ name: '', slug: '', description: '' });
        setShowForm(false);
      },
      onError: (errors: any) => setError(errors?.name || 'Failed to create subclass.'),
    });
  };

  // When opening the sheet, prefill the form
  const handleRowClick = (sub: any) => {
    setEditSubclass(sub);
    setEditForm({ name: sub.name, slug: sub.slug, description: sub.description || '' });
    setEditError('');
    setEditSheetOpen(true);
  };

  // Handler for closing the edit sheet
  const handleEditSheetClose = () => {
    setEditSheetOpen(false);
    setEditSubclass(null);
  };

  // Update handler for edit form
  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Update subclass
  const handleEditSubmit = (e: any) => {
    e.preventDefault();
    setEditError('');
    if (!editSubclass) return;
    router.put(
      `/admin/property-classifications/${classification.id}/classes/${propertyClass.id}/subclasses/${editSubclass.id}`,
      editForm,
      {
        onSuccess: () => {
          setEditSheetOpen(false);
          setEditSubclass(null);
        },
        onError: (errors: any) => setEditError(errors?.name || 'Failed to update subclass.'),
        preserveScroll: true,
      }
    );
  };

  // Delete subclass
  const handleDelete = () => {
    if (!editSubclass) return;
    if (!window.confirm('Are you sure you want to delete this subclass?')) return;
    router.delete(
      `/admin/property-classifications/${classification.id}/classes/${propertyClass.id}/subclasses/${editSubclass.id}`,
      {
        onSuccess: () => {
          setEditSheetOpen(false);
          setEditSubclass(null);
        },
        onError: () => setEditError('Failed to delete subclass.'),
        preserveScroll: true,
      }
    );
  };

  const handleCreateChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    router.post(`/admin/property-classifications/${classification.id}/classes/${propertyClass.id}/subclasses`, form, {
      onSuccess: () => {
        setForm({ name: '', slug: '', description: '' });
        setCreateSheetOpen(false);
      },
      onError: (errors: any) => setError(errors?.name || 'Failed to create subclass.'),
    });
  };

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Property Classifications', href: '/admin/property-classifications' },
          { title: classification.name, href: `/admin/property-classifications/${classification.id}/classes` },
          { title: propertyClass.name, href: `/admin/property-classifications/${classification.id}/classes/${propertyClass.id}/subclasses` },
        ]} />
        <Head title="Property Subclasses" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h1 className="text-2xl font-bold">Property Subclasses for {propertyClass.name}</h1>
            <div className="md:ml-4">
              <Button onClick={() => setCreateSheetOpen(true)}>{showForm ? 'Cancel' : 'Add Subclass'}</Button>
            </div>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 max-w-md">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border rounded px-3 py-2" required />
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="border rounded px-3 py-2" required />
              <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border rounded px-3 py-2" />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit">Save</Button>
            </form>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {subclasses.length === 0 && (
                  <tr><td className="text-center py-4 text-gray-500" colSpan={3}>No subclasses found.</td></tr>
                )}
                {subclasses.map((sub: any) => (
                  <tr
                    key={sub.id}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                    tabIndex={0}
                    onClick={() => handleRowClick(sub)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(sub); }}
                    aria-label={`Edit subclass ${sub.name}`}
                  >
                    <td className="px-4 py-2 font-semibold">{sub.name}</td>
                    <td className="px-4 py-2">{sub.slug}</td>
                    <td className="px-4 py-2">{sub.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Edit Sheet */}
          <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
            <SheetContent aria-describedby="edit-subclass-desc">
              <SheetHeader>
                <SheetTitle>Edit Subclass</SheetTitle>
              </SheetHeader>
              <div id="edit-subclass-desc" className="sr-only">Edit the selected property subclass details.</div>
              {editSubclass && (
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
          {/* Create Sheet */}
          <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
            <SheetContent aria-describedby="create-subclass-desc">
              <SheetHeader>
                <SheetTitle>Add Subclass</SheetTitle>
              </SheetHeader>
              <div id="create-subclass-desc" className="sr-only">Create a new property subclass.</div>
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
        </div>
      </AdminContent>
    </AdminShell>
  );
}
