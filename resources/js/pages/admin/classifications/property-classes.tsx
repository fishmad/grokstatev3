import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function AdminPropertyClasses() {
  const { classification, classes = [] } = usePage().props as any;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [error, setError] = useState('');
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editClass, setEditClass] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', description: '' });
  const [editError, setEditError] = useState('');
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    router.post(`/admin/property-classifications/${classification.id}/classes`, form, {
      onSuccess: () => {
        setForm({ name: '', slug: '', description: '' });
        setShowForm(false);
      },
      onError: (errors: any) => setError(errors?.name || 'Failed to create class.'),
    });
  };

  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e: any) => {
    e.preventDefault();
    setEditError('');
    router.put(`/admin/property-classifications/${classification.id}/classes/${editClass.id}`, editForm, {
      onSuccess: () => {
        setEditSheetOpen(false);
        setEditClass(null);
      },
      onError: (errors: any) => setEditError(errors?.name || 'Failed to update class.'),
    });
  };

  const handleDelete = () => {
    if (!editClass) return;
    if (confirm(`Are you sure you want to delete the class "${editClass.name}"?`)) {
      router.delete(`/admin/property-classifications/${classification.id}/classes/${editClass.id}`, {
        onSuccess: () => {
          setEditSheetOpen(false);
          setEditClass(null);
        },
        onError: () => alert('Failed to delete class.'),
      });
    }
  };

  const handleRowClick = (cls: any) => {
    setEditClass(cls);
    setEditForm({ name: cls.name, slug: cls.slug, description: cls.description });
    setEditSheetOpen(true);
  };

  const handleCreateChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    router.post(`/admin/property-classifications/${classification.id}/classes`, form, {
      onSuccess: () => {
        setForm({ name: '', slug: '', description: '' });
        setCreateSheetOpen(false);
      },
      onError: (errors: any) => setError(errors?.name || 'Failed to create class.'),
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
        ]} />
        <Head title="Property Classes" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h1 className="text-2xl font-bold">Property Classes for {classification.name}</h1>
            <div className="md:ml-4">
              <Button onClick={() => setCreateSheetOpen(true)}>{showForm ? 'Cancel' : 'Add Class'}</Button>
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
                  <th className="px-4 py-2 text-left">Subclasses</th>
                </tr>
              </thead>
              <tbody>
                {classes.length === 0 && (
                  <tr><td className="text-center py-4 text-gray-500" colSpan={4}>No classes found.</td></tr>
                )}
                {classes.map((cls: any) => (
                  <tr
                    key={cls.id}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                    tabIndex={0}
                    onClick={() => handleRowClick(cls)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(cls); }}
                    aria-label={`Edit class ${cls.name}`}
                  >
                    <td className="px-4 py-2 font-semibold">{cls.name}</td>
                    <td className="px-4 py-2">{cls.slug}</td>
                    <td className="px-4 py-2">{cls.description}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); router.get(`/admin/property-classifications/${classification.id}/classes/${cls.id}/subclasses`); }}>View Subclasses</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent aria-describedby="edit-class-desc">
            <SheetHeader>
              <SheetTitle>Edit Class</SheetTitle>
            </SheetHeader>
            <div id="edit-class-desc" className="sr-only">Edit the selected property class details.</div>
            {editClass && (
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
          <SheetContent aria-describedby="create-class-desc">
            <SheetHeader>
              <SheetTitle>Add Class</SheetTitle>
            </SheetHeader>
            <div id="create-class-desc" className="sr-only">Create a new property class.</div>
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
