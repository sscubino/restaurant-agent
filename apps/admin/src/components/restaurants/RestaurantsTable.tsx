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
import type { Restaurant } from "@/services/api/restaurants";

interface RestaurantsTableProps {
  restaurants: Restaurant[];
  handleDeleteRestaurant: (restaurantId: string) => void;
  handleCreateRestaurant: () => void;
  isLoading?: boolean;
}

const RestaurantsTable = ({
  restaurants: restaurants,
  handleDeleteRestaurant,
  handleCreateRestaurant,
  isLoading = false,
}: RestaurantsTableProps) => {
  const columns: ColumnDef<Restaurant>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <DataTableHeaderWithSorting column={column} header="Restaurant" />
        );
      },
      cell: ({ row }) => {
        return <div>{row.original.name ?? "-"}</div>;
      },
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Phone" />;
      },
      cell: ({ row }) => {
        return <div>{row.original.phone ?? "-"}</div>;
      },
    },
    {
      id: "user.name",
      accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Owner" />;
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.user.firstName} {row.original.user.lastName}
          </div>
        );
      },
    },
    {
      id: "user.email",
      accessorKey: "user.email",
      header: ({ column }) => {
        return <DataTableHeaderWithSorting column={column} header="Contact" />;
      },
      cell: ({ row }) => {
        return <div>{row.original.user.email}</div>;
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
        const restaurant = row.original;

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
                onClick={() => handleDeleteRestaurant(restaurant.id)}
              >
                Delete restaurant
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
      data={restaurants}
      isLoading={isLoading}
      actionButtons={
        <Button onClick={handleCreateRestaurant}>
          <Plus className="h-4 w-4" />
          Add Restaurant
        </Button>
      }
    />
  );
};

export { RestaurantsTable };
