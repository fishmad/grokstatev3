import { Head, Link, usePage, router } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs = [
  { title: 'Admin Panel', href: '/admin' },
  { title: 'Constants', href: '/admin/constants' },
];

interface Constant {
  id: number;
  key: string;
  value: any;
  description: string;
  is_active: boolean;
}

interface ConstantsIndexPageProps {
  constants: Constant[];
  filters: { search?: string };
  [key: string]: any;
}

export default function ConstantsIndex() {
  const { constants, filters = {} } = usePage<{ constants: any, filters: any }>().props;
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: filters.sort || 'id', desc: (filters.direction || 'desc') === 'desc' },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [search, setSearch] = React.useState(filters.search || '');
  const [pageSize, setPageSize] = React.useState(Number(filters.perPage) || 5);
  const [pageIndex, setPageIndex] = React.useState((constants.current_page || 1) - 1);

  // Handle server-side search
  React.useEffect(() => {
    if (search !== (filters.search || '')) {
      router.get(route('admin.constants.index'), {
        search,
        perPage: pageSize,
        page: 1,
        sort: sorting[0]?.id || 'id',
        direction: sorting[0]?.desc ? 'desc' : 'asc',
      }, { preserveState: true, replace: true });
    }
    // eslint-disable-next-line
  }, [search]);

  // Handle server-side sorting
  React.useEffect(() => {
    if (sorting.length) {
      router.get(route('admin.constants.index'), {
        search,
        perPage: pageSize,
        page: 1,
        sort: sorting[0].id,
        direction: sorting[0].desc ? 'desc' : 'asc',
      }, { preserveState: true, replace: true });
    }
    // eslint-disable-next-line
  }, [sorting]);

  // Handle server-side page size change
  React.useEffect(() => {
    router.get(route('admin.constants.index'), {
      search,
      perPage: pageSize,
      page: 1,
      sort: sorting[0]?.id || 'id',
      direction: sorting[0]?.desc ? 'desc' : 'asc',
    }, { preserveState: true, replace: true });
    setPageIndex(0);
    // eslint-disable-next-line
  }, [pageSize]);

  // Handle server-side page change
  React.useEffect(() => {
    if (pageIndex !== (constants.current_page - 1)) {
      router.get(route('admin.constants.index'), {
        search,
        perPage: pageSize,
        page: pageIndex + 1,
        sort: sorting[0]?.id || 'id',
        direction: sorting[0]?.desc ? 'desc' : 'asc',
      }, { preserveState: true, replace: true });
    }
    // eslint-disable-next-line
  }, [pageIndex]);

  // --- Local state for create dialog form ---
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    key: '',
    value: '',
    valueIsJson: false,
    description: '',
    is_active: true,
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function handleDialogChange(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleDialogSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    let valueToSend = form.value;
    if (form.valueIsJson) {
      try {
        valueToSend = JSON.parse(form.value);
      } catch {
        setFormError('Invalid JSON value.');
        setSubmitting(false);
        return;
      }
    }
    fetch(route('admin.constants.store'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
      },
      body: JSON.stringify({
        key: form.key,
        value: valueToSend,
        description: form.description,
        is_active: form.is_active ? 1 : 0,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to create');
        const data = await res.json();
        setDialogOpen(false);
        setForm({ key: '', value: '', valueIsJson: false, description: '', is_active: true });
        setSubmitting(false);
        // Optionally: trigger a reload or refetch if you want to see the new row
        // router.reload({ only: ['constants'] });
      })
      .catch(() => {
        setFormError('Failed to create constant.');
        setSubmitting(false);
      });
  }

  // Define columns for react-table
  const columns = React.useMemo(() => [
    {
      accessorKey: 'id',
      header: ({ column }: any) => 'ID', // label only, onClick now on TableHead
      cell: ({ row }: any) => <span>{row.getValue('id')}</span>,
      enableHiding: false,
    },
    {
      accessorKey: 'key',
      header: ({ column }: any) => 'Key',
      cell: ({ row }: any) => <span>{row.getValue('key')}</span>,
    },
    {
      accessorKey: 'value',
      header: () => <span>Value</span>,
      cell: ({ row }: any) => (
        <pre className="whitespace-pre-wrap text-xs max-w-xs overflow-x-auto">{JSON.stringify(row.getValue('value'), null, 2)}</pre>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }: any) => 'Description',
      cell: ({ row }: any) => {
        const desc = row.getValue('description');
        return (
          <span title={desc} className="truncate block max-w-xs">
            {desc && desc.length > 100 ? desc.slice(0, 100) + '…' : desc}
          </span>
        );
      },
    },
    {
      accessorKey: 'usage',
      header: ({ column }: any) => 'Usage',
      cell: ({ row }: any) => {
        const usage = row.getValue('usage');
        return (
          <span title={usage} className="truncate block max-w-xs">
            {usage && usage.length > 100 ? usage.slice(0, 100) + '…' : usage}
          </span>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: ({ column }: any) => 'Status',
      cell: ({ row }: any) => (
        <span className={row.getValue('is_active') ? 'text-green-600' : 'text-gray-400'}>
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <span>Actions</span>,
      cell: ({ row }: any) => row.original && (
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={route('admin.constants.edit', row.original.id)}>Edit</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary">Edit Inline</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Constant</DialogTitle>
              </DialogHeader>
              <EditConstantForm constant={row.original} />
            </DialogContent>
          </Dialog>
        </div>
      ),
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    data: constants.data,
    columns,
    pageCount: constants.last_page,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    initialState: { pagination: { pageIndex, pageSize } },
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
    table.setPageIndex(0);
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <Head title="Constants" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <h1 className="text-2xl font-bold mb-4">Constants</h1>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Filter by key..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={route('admin.constants.create')} className="whitespace-nowrap">+ New Constant</Link>
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" type="button">New Constant</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>New Constant</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDialogSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Key</Label>
                    <Input id="key" value={form.key} onChange={e => handleDialogChange('key', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="value">Value</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">TEXT</span>
                        <Switch
                          id="valueIsJson"
                          checked={form.valueIsJson}
                          onCheckedChange={(checked: boolean) => handleDialogChange('valueIsJson', checked)}
                        />
                        <span className="text-xs text-muted-foreground">JSON</span>
                      </div>
                    </div>
                    <Textarea id="value" value={form.value} onChange={e => handleDialogChange('value', e.target.value)} required rows={form.valueIsJson ? 4 : 2} placeholder={form.valueIsJson ? '{\n  "foo": "bar"\n}' : 'Value'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={form.description} onChange={e => handleDialogChange('description', e.target.value)} rows={2} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={form.is_active}
                      onCheckedChange={(checked: boolean) => handleDialogChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  {formError && <div className="text-sm text-red-500">{formError}</div>}
                  <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
                    <Button type="submit" disabled={submitting} className="w-full col-span-1">Create</Button>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost" className="w-full col-span-1">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="flex justify-center mb-2">
            <label htmlFor="results-per-page" className="mr-2 font-medium">Results per page:</label>
            <select
              id="results-per-page"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1 dark:bg-neutral-900 dark:border-neutral-700"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => {
                    const sortable = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    // Add rounded-tl-md to the first header cell on hover
                    const isFirst = i === 0;
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          'pl-5' +
                          (sortable ? ' hover:bg-accent cursor-pointer select-none transition-colors' : '') +
                          (isFirst ? ' hover:rounded-tl-md' : '')
                        }
                        onClick={sortable ? () => header.column.toggleSorting(sorted === 'asc') : undefined}
                        aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
                        tabIndex={sortable ? 0 : undefined}
                        role="columnheader"
                      >
                        <span className="inline-flex items-center">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortable && (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-70" />
                          )}
                        </span>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="pl-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {constants.total} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex + 1 >= constants.last_page}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function EditConstantForm({ constant }: { constant: any }) {
  const [form, setForm] = React.useState({
    key: constant.key || '',
    value: typeof constant.value === 'object' ? JSON.stringify(constant.value, null, 2) : String(constant.value ?? ''),
    valueIsJson: typeof constant.value === 'object',
    description: constant.description || '',
    is_active: !!constant.is_active,
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function handleDialogChange(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleDialogSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    let valueToSend = form.value;
    if (form.valueIsJson) {
      try {
        valueToSend = JSON.parse(form.value);
      } catch {
        setFormError('Invalid JSON value.');
        setSubmitting(false);
        return;
      }
    }
    // Use fetch for AJAX update to get JSON response
    fetch(route('admin.constants.update', constant.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
      },
      body: JSON.stringify({
        key: form.key,
        value: valueToSend,
        description: form.description,
        is_active: form.is_active ? 1 : 0,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to update');
        const data = await res.json();
        setSubmitting(false);
        // Close dialog by simulating click on cancel
        document.activeElement?.dispatchEvent(new Event('click', { bubbles: true }));
      })
      .catch(() => {
        setFormError('Failed to update constant.');
        setSubmitting(false);
      });
  }

  return (
    <form onSubmit={handleDialogSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-key">Key</Label>
        <Input id="edit-key" value={form.key} onChange={e => handleDialogChange('key', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="edit-value">Value</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">TEXT</span>
            <Switch
              id="edit-valueIsJson"
              checked={form.valueIsJson}
              onCheckedChange={(checked: boolean) => handleDialogChange('valueIsJson', checked)}
            />
            <span className="text-xs text-muted-foreground">JSON</span>
          </div>
        </div>
        <Textarea id="edit-value" value={form.value} onChange={e => handleDialogChange('value', e.target.value)} required rows={form.valueIsJson ? 4 : 2} placeholder={form.valueIsJson ? '{\n  "foo": "bar"\n}' : 'Value'} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea id="edit-description" value={form.description} onChange={e => handleDialogChange('description', e.target.value)} rows={2} />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="edit-is_active"
          checked={form.is_active}
          onCheckedChange={(checked: boolean) => handleDialogChange('is_active', checked)}
        />
        <Label htmlFor="edit-is_active">Active</Label>
      </div>
      {formError && <div className="text-sm text-red-500">{formError}</div>}
      <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
        <Button type="submit" disabled={submitting} className="w-full col-span-1">Save</Button>
        <DialogClose asChild>
          <Button type="button" variant="ghost" className="w-full col-span-1">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}