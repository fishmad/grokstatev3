import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PropertyForm } from '@/components/property/property-form';
import PropertyImageManager from '@/components/property/property-image-manager';
import PropertyMap from '@/components/property/property-map';

export default function AdminPropertiesCreate() {
  const [form, setForm] = useState({
    address: '',
    type_id: '',
    status: '',
    price: '',
    // Add other required fields as needed
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Dummy/defaults for required props
  const errors = {};
  const reset = () => setForm({ address: '', type_id: '', status: '', price: '' });
  const allFeatures: any[] = [];
  const priceMode: 'asking' = 'asking';
  const setPriceMode = () => {};
  const newImagePreviews: string[] = [];
  const setNewImagePreviews = () => {};
  const selectedImages: File[] = [];
  const setSelectedImages = () => {};
  const handleSortNewImages = () => {};
  const handleSetPrimaryNew = () => {};
  const propertyTypes: string[] = [];
  const propertyStatuses: string[] = [];
  const listingTypes: string[] = [];

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    router.post('/admin/properties', form, {
      onError: (errors: any) => setError(errors?.address || 'Failed to create property.'),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Properties', href: '/admin/properties' },
          { title: 'Create', href: '/admin/properties/create' },
        ]} />
        <Head title="Add Property" />
        <div className="p-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Add Property</h1>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
          <PropertyForm
            data={form}
            setData={(field, value) => setForm(f => ({ ...f, [field]: value }))}
            errors={error ? { address: error } : errors}
            processing={processing}
            reset={reset}
            onSubmit={handleSubmit}
            allFeatures={allFeatures}
            priceMode={priceMode}
            setPriceMode={setPriceMode}
            newImagePreviews={newImagePreviews}
            setNewImagePreviews={setNewImagePreviews}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            handleSortNewImages={handleSortNewImages}
            handleSetPrimaryNew={handleSetPrimaryNew}
            propertyTypes={propertyTypes}
            propertyStatuses={propertyStatuses}
            listingTypes={listingTypes}
          />
          <PropertyImageManager />
          <PropertyMap />
        </div>
      </AdminContent>
    </AdminShell>
  );
}
