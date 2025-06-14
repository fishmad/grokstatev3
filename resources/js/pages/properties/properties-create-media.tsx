import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';

export default function PropertiesCreateMedia({ propertyId, nextStep, prevStep, media = [] }: { propertyId: number, nextStep: () => void, prevStep: () => void, media?: any[] }) {
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Head title="Upload Property Media" />
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Media</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" multiple onChange={handleFileChange} />
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
      <div className="flex justify-between mt-8">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
