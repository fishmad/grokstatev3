import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { type User } from "@/types";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => 'ID',
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => 'Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => 'Role',
    cell: ({ row }) => <span>{row.getValue("role")}</span>,
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => 'Phone',
    cell: ({ row }) => row.getValue("phone_number") || <span className="italic text-gray-400">-</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => 'Email',
    cell: ({ row }) => <span className="lowercase">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => 'Company',
    cell: ({ row }) => row.getValue("company_name") || <span className="italic text-gray-400">-</span>,
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <span className={
          row.original.status === 'active'
            ? 'inline-block w-2 h-2 rounded-full bg-green-500'
            : 'inline-block w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600'
        } />
        <span className="capitalize text-xs text-muted-foreground">{row.original.status}</span>
      </span>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "property_count",
    header: () => <span>Properties</span>,
    cell: ({ row }) => {
      const count = row.original.property_count;
      const userId = row.original.id;
      return (
        <span>
          {count && count > 0 ? (
            <Button variant="outline" asChild size="sm" className="px-6 py-0 h-7">
              <Link
                href={route('admin.properties.index', { user_id: userId })}
                aria-label={`View properties for user ${row.original.name}`}
                tabIndex={-1}
              >
                {count}
              </Link>
            </Button>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </span>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem asChild>
              <Link href={route('admin.users.edit', user.id)}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={route('admin.users.show', user.id)}>
                View
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
