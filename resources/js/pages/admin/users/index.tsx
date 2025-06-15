import AdminLayout from '@/layouts/admin-layout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem, type Paginated, type User } from '@/types';
import { columns } from './columns';
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Admin Panel', href: route('admin.index') },
  { title: 'Manage Users', href: route('admin.users.index') },
];

export default function UsersIndex() {
  const { users, filters } = usePage<{ users: Paginated<User>, filters: { search?: string } }>().props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [search, setSearch] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 400);

  React.useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      router.get(route('admin.users.index'), { search: debouncedSearch }, { preserveState: true, replace: true });
    }
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const table = useReactTable({
    data: users.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: false,
    pageCount: users.last_page,
  });

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Filter name, email, or company..."
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
          <Button asChild>
            <Link href={route('admin.users.create')} className="whitespace-nowrap">+ New User</Link>
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => {
                    const sortable = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    // Add rounded-tl-md to the first header cell on hover if desired (optional)
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="pl-5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
