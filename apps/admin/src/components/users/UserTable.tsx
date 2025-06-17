import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Plus } from "lucide-react";

import { DataTable, DataTableHeaderWithSorting } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/components/users/ManageUsers";

interface UserTableProps {
  users: User[];
  handleEditUser: (user: User) => void;
  handleDeleteUser: (userId: string) => void;
  handleCreateUser: () => void;
}

const UserTable = ({
  users,
  handleEditUser,
  handleDeleteUser,
  handleCreateUser,
}: UserTableProps) => {
  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Name" />;
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Email" />;
      },
      cell: ({ row }) => {
        return <div>{row.original.email}</div>;
      },
    },
    {
      id: "companyName",
      accessorKey: "companyName",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Company Name" />
        );
      },
      cell: ({ row }) => {
        return <div>{row.original.companyName}</div>;
      },
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Phone" />;
      },
      cell: ({ row }) => {
        return <div>{row.original.phone}</div>;
      },
    },
    {
      id: "creationDate",
      accessorKey: "creationDate",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Creation Date" />
        );
      },
      cell: ({ row }) => {
        return (
          <div>{format(row.original.creationDate, "yyyy-MM-dd HH:mm a")}</div>
        );
      },
    },
    {
      id: "actions",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex justify-end">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      actionButtons={
        <Button onClick={handleCreateUser}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      }
    />
  );
};

export { UserTable };
