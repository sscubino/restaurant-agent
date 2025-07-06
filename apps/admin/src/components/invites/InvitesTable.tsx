import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, MoreHorizontal, Plus, Trash } from "lucide-react";

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
import type { InviteCode } from "@/services/api/invite-codes";

interface InvitesTableProps {
  inviteCodes: InviteCode[];
  handleCopyInviteLink: (inviteCode: string) => void;
  handleDeleteInvite: (inviteId: string) => void;
  handleCreateInvite: () => void;
  isLoading?: boolean;
}

const InvitesTable = ({
  inviteCodes,
  handleCopyInviteLink,
  handleDeleteInvite,
  handleCreateInvite,
  isLoading = false,
}: InvitesTableProps) => {
  const columns: ColumnDef<InviteCode>[] = [
    {
      id: "code",
      accessorKey: "code",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Code" />;
      },
      cell: ({ row }) => {
        return <div className="font-mono">{row.original.code}</div>;
      },
    },
    {
      id: "twilioPhoneNumber",
      accessorKey: "twilioPhoneNumber",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Phone Number" />
        );
      },
      cell: ({ row }) => {
        return <div>{row.original.twilioPhoneNumber}</div>;
      },
    },
    {
      id: "isUsed",
      accessorKey: "isUsed",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Status" />;
      },
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.isUsed ? "secondary" : "default"}>
            {row.original.isUsed ? "Used" : "Available"}
          </Badge>
        );
      },
    },
    {
      id: "usedBy",
      accessorFn: (row) => {
        if (!row.usedBy) return null;
        return `${row.usedBy.firstName} ${row.usedBy.lastName}`;
      },
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Used By" />;
      },
      cell: ({ row }) => {
        if (!row.original.usedBy) return <div>-</div>;
        return (
          <div>
            {row.original.usedBy.firstName} {row.original.usedBy.lastName}
          </div>
        );
      },
    },
    {
      id: "usedAt",
      accessorFn: (row) => {
        if (!row.usedAt) return null;
        return new Date(row.usedAt);
      },
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Used At" />;
      },
      cell: ({ row }) => {
        if (!row.original.usedAt) return <div>-</div>;
        return (
          <div>
            {format(new Date(row.original.usedAt), "MMM dd, yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      id: "createdAt",
      accessorFn: (row) => new Date(row.createdAt),
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Created At" />
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {format(new Date(row.original.createdAt), "MMM dd, yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inviteCode = row.original;

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
                onClick={() => handleCopyInviteLink(inviteCode.code)}
              >
                <Copy className="h-4 w-4 text-inherit" />
                Copy invite link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteInvite(inviteCode.id)}
                className="text-destructive"
              >
                <Trash className="h-4 w-4 text-inherit" />
                Delete invite code
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
      data={inviteCodes}
      isLoading={isLoading}
      actionButtons={
        <Button onClick={handleCreateInvite}>
          <Plus className="h-4 w-4" />
          Add Invite Code
        </Button>
      }
    />
  );
};

export default InvitesTable;
