import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function CreateUser() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    role: 'user',
    company_name: '',
    profile_picture: '',
    status: 'active',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route('admin.users.store'));
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Panel', href: route('admin.index') },
    { title: 'Users', href: route('admin.users.index') },
    { title: 'Create', href: '#' },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />
      <div className="max-w-xl mx-auto bg-background rounded-xl shadow p-8 mt-8 border border-border">
        <h1 className="text-2xl font-bold mb-6">Create User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <Input
              type="text"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              required
              autoComplete="username"
            />
            {errors.name && <div className="text-destructive text-sm mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <Input
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              required
            />
            {errors.email && <div className="text-destructive text-sm mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <Input
              type="text"
              value={data.phone_number}
              onChange={e => setData('phone_number', e.target.value)}
            />
            {errors.phone_number && <div className="text-destructive text-sm mt-1">{errors.phone_number}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Role</label>
            <Select value={data.role} onValueChange={val => setData('role', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <div className="text-destructive text-sm mt-1">{errors.role}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <Input
              type="text"
              value={data.company_name}
              onChange={e => setData('company_name', e.target.value)}
            />
            {errors.company_name && <div className="text-destructive text-sm mt-1">{errors.company_name}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Profile Picture URL</label>
            <Input
              type="text"
              value={data.profile_picture}
              onChange={e => setData('profile_picture', e.target.value)}
            />
            {errors.profile_picture && <div className="text-destructive text-sm mt-1">{errors.profile_picture}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <Input
              type="password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              autoComplete="new-password"
              required
            />
            {errors.password && <div className="text-destructive text-sm mt-1">{errors.password}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <Input
              type="password"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              autoComplete="new-password"
              required
            />
            {errors.password_confirmation && <div className="text-destructive text-sm mt-1">{errors.password_confirmation}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <div className="flex items-center gap-3">
              <span className={
                data.status === 'active'
                  ? 'inline-block w-2 h-2 rounded-full bg-green-500'
                  : 'inline-block w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600'
              } />
              <Button
                type="button"
                variant={data.status === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setData('status', data.status === 'active' ? 'inactive' : 'active')}
                className="capitalize"
              >
                {data.status === 'active' ? 'Active' : 'Inactive'}
              </Button>
            </div>
            {errors.status && <div className="text-destructive text-sm mt-1">{errors.status}</div>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={processing}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
