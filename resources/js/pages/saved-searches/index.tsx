import PublicLayout from '@/layouts/public-layout';
import { type SavedSearch, type SharedData, type Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from '@tanstack/react-table';
import React from 'react';

interface SavedSearchesIndexProps extends SharedData {
    savedSearches: Paginated<SavedSearch>;
}

export default function SavedSearchesIndex({ savedSearches, flash }: SavedSearchesIndexProps) {
    const { data, current_page, last_page, links } = savedSearches;

    const renderSearchParameters = (params: Record<string, any>) => {
        return Object.entries(params)
            .filter(([, value]) => value !== null && value !== '')
            .map(([key, value]) => (
                <Badge key={key} variant="secondary" className="mr-1 mb-1">
                    {key.replace(/_/g, ' ')}: {String(value)}
                </Badge>
            ));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this saved search?')) {
            router.delete(route('saved-searches.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const columns = React.useMemo<ColumnDef<SavedSearch>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: info => <span className="font-medium">{String(info.getValue())}</span>,
            },
            {
                accessorKey: 'search_parameters',
                header: 'Parameters',
                cell: info => renderSearchParameters(info.getValue() as Record<string, any>),
            },
            {
                accessorKey: 'receive_alerts',
                header: 'Alerts',
                cell: info => (
                    <Badge variant={info.getValue() ? 'default' : 'outline'}>
                        {info.getValue() ? 'Yes' : 'No'}
                    </Badge>
                ),
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const search = row.original;
                    return (
                        <div className="text-right space-x-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('properties.index', search.search_parameters as any)}>
                                    View Results
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('saved-searches.edit', search.id)}>Edit</Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(search.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <PublicLayout>
            <Head title="My Saved Searches" />
            <div className="container mx-auto py-6 px-4 md:px-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>My Saved Searches</CardTitle>
                        <Button asChild>
                            <Link href={route('saved-searches.create')}>Save Current Search</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {flash?.success && (
                            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
                                {flash.success}
                            </div>
                        )}
                        {data.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-lg text-muted-foreground">You have no saved searches yet.</p>
                                <p className="mt-2">
                                    You can save your filter criteria from the{' '}
                                    <Link href={route('properties.index')} className="text-primary hover:underline">
                                        property listings page
                                    </Link>.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            {table.getHeaderGroups().map(headerGroup => (
                                                <tr key={headerGroup.id} className="border-b">
                                                    {headerGroup.headers.map(header => (
                                                        <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody>
                                            {table.getRowModel().rows.map(row => (
                                                <tr key={row.id} className="border-b hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    {row.getVisibleCells().map(cell => (
                                                        <td key={cell.id} className="p-4 align-middle">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination Implementation using Laravel's pagination links */}
                                {links && links.length > 3 && (
                                    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between">
                                        <div className="flex flex-1 justify-between sm:justify-end">
                                            {links.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={`link-${index}`}
                                                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-default leading-5 rounded-md mx-1"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={`link-${index}`}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border leading-5 rounded-md mx-1 transition ease-in-out duration-150
                                                            ${link.active
                                                                ? 'bg-primary text-primary-foreground border-primary dark:bg-primary dark:text-primary-foreground dark:border-primary z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light'
                                                            }
                                                            ${!link.url ? 'cursor-default' : ''}`}
                                                        preserveScroll
                                                        preserveState
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </nav>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
