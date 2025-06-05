import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PropertiesCreateMedia({ propertyId, media = [] }: { propertyId: number, media?: any[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    files.forEach(file => formData.append('media[]', file));
    try {
      await router.post(`/properties/${propertyId}/media`, formData, {
        forceFormData: true,
        onSuccess: () => {
          setSuccess('Media uploaded successfully!');
          setFiles([]);
        },
        onError: (err: any) => setError('Upload failed.'),
        preserveScroll: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Properties', href: '/properties' }, { title: 'Upload Media', href: '#' }]}> 
      <Head title="Upload Property Media" />
      <div className="max-w-xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Upload Media</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input type="file" multiple onChange={handleFileChange} />
          <Button type="submit" disabled={uploading || files.length === 0}>Upload</Button>
        </form>
        {success && <div className="mt-4 text-green-600">{success}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Current Media</h3>
          <div className="grid grid-cols-3 gap-4">
            {media.map((m: any) => (
              <div key={m.id} className="border rounded p-2 flex flex-col items-center">
                <img src={m.url} alt="media" className="max-h-32 object-contain mb-2" />
                <Button size="sm" variant="destructive" onClick={() => router.delete(`/properties/${propertyId}/media/${m.id}`)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
