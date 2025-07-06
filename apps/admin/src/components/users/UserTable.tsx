import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Plus, Trash } from "lucide-react";

import { DataTable, DataTableHeaderWithSorting } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/services/api/users";

interface UserTableProps {
  users: User[];
  handleDeleteUser: (userId: string) => void;
  handleCreateUser: () => void;
  isLoading?: boolean;
}

const UserTable = ({
  users,
  handleDeleteUser,
  handleCreateUser,
  isLoading = false,
}: UserTableProps) => {
  const columns: ColumnDef<User>[] = [
    {
      id: "firstName",
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="First Name" />
        );
      },
      cell: ({ row }) => {
        return <div>{row.original.firstName}</div>;
      },
    },
    {
      id: "lastName",
      accessorKey: "lastName",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Last Name" />
        );
      },
      cell: ({ row }) => {
        return <div>{row.original.lastName}</div>;
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
      id: "isSuperUser",
      accessorKey: "isSuperUser",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Role" />;
      },
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.isSuperUser ? "secondary" : "outline"}>
            {row.original.isSuperUser ? "Super User" : "Restaurant"}
          </Badge>
        );
      },
    },
    {
      id: "lastLogin",
      accessorKey: "lastLogin",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Last Login" />
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.lastLogin
              ? format(row.original.lastLogin, "yyyy-MM-dd HH:mm a")
              : "Never"}
          </div>
        );
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
          <div>{format(row.original.createdAt, "yyyy-MM-dd HH:mm a")}</div>
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
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user.id)}
                variant="destructive"
              >
                <Trash className="h-4 w-4" />
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
      isLoading={isLoading}
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
