import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ensureStringValue = (val: any) => {
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
};

const ConstantCreate = () => {
  const { data, setData, post, processing, errors } = useForm({
    category: '',
    key: '',
    value: '',
    description: '',
    is_active: true,
    usage: '',
  });

  const [valueMode, setValueMode] = useState<'json' | 'text'>('json');
  const [isJsonValid, setIsJsonValid] = useState(true);

  const breadcrumbs = [
    { title: 'Admin Panel', href: route('admin.index') },
    { title: 'Constants', href: route('admin.constants.index') },
    { title: 'Create', href: '#' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked ? 'true' : 'false';
    }
    setData(name as keyof typeof data, newValue);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setData('value', val);
    if (valueMode === 'json') {
      try {
        JSON.parse(val);
        setIsJsonValid(true);
      } catch {
        setIsJsonValid(false);
      }
    } else {
      setIsJsonValid(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.constants.store'), {
      onSuccess: () => router.visit(route('admin.constants.index')),
    });
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Create Constant</h1>
          <Button asChild variant="outline" className="ml-4">
            <a href={route('admin.constants.index')}>Back to Constants</a>
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-xl shadow border w-full p-6 flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <Input type="text" name="category" value={data.category} onChange={handleChange} />
            {errors.category && <div className="text-red-500 text-sm">{errors.category}</div>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Key</label>
            <Input type="text" name="key" value={data.key} onChange={handleChange} />
            {errors.key && <div className="text-red-500 text-sm">{errors.key}</div>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Value</label>
            <div className="flex gap-2 mb-2">
              <Button type="button" variant={valueMode === 'json' ? 'default' : 'outline'} size="sm" onClick={() => setValueMode('json')}>JSON</Button>
              <Button type="button" variant={valueMode === 'text' ? 'default' : 'outline'} size="sm" onClick={() => setValueMode('text')}>Plain Text</Button>
            </div>
            <textarea
              name="value"
              value={data.value}
              onChange={handleValueChange}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-900 dark:border-neutral-700"
              rows={3}
              placeholder={valueMode === 'json' ? '["option1", "option2"] or {"key": "value"}' : 'Enter plain text value'}
            />
            {valueMode === 'json' && !isJsonValid && (
              <div className="text-red-500 text-sm">Invalid JSON format</div>
            )}
            {errors.value && <div className="text-red-500 text-sm">{errors.value}</div>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Usage</label>
            <Input type="text" name="usage" value={data.usage} onChange={handleChange} />
            {errors.usage && <div className="text-red-500 text-sm">{errors.usage}</div>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <Input type="text" name="description" value={data.description} onChange={handleChange} />
            {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_active" checked={data.is_active === true || data.is_active === 'true' || data.is_active === 1 || data.is_active === '1'} onChange={handleChange} className="accent-blue-600 dark:accent-blue-400" />
            <label className="font-semibold">Active</label>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={processing}>Create</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ConstantCreate;
