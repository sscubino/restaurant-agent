import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import DeleteRestaurantAlertDialog from "@/components/restaurants/DeleteRestaurantAlertDialog";
import RestaurantDialog from "@/components/restaurants/RestaurantDialog";
import { RestaurantsTable } from "@/components/restaurants/RestaurantsTable";
import { useRestaurants } from "@/hooks/useRestaurants";

export default function ManageRestaurants() {
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingRestaurantId, setDeletingRestaurantId] = useState<
    string | null
  >(null);
  const location = useLocation();

  const { data: restaurants = [], isLoading } = useRestaurants();

  useEffect(() => {
    if (location.state?.create) {
      setIsRestaurantDialogOpen(true);
    }
  }, [location.state?.create]);

  const handleOpenCreateDialog = () => {
    setIsRestaurantDialogOpen(true);
  };

  const handleOpenDeleteDialog = (restaurantId: string) => {
    setIsDeleteDialogOpen(true);
    setDeletingRestaurantId(restaurantId);
  };

  const deletingRestaurant =
    restaurants.find((r) => r.id === deletingRestaurantId) || null;

  return (
    <>
      <RestaurantsTable
        restaurants={restaurants}
        handleDeleteRestaurant={handleOpenDeleteDialog}
        handleCreateRestaurant={handleOpenCreateDialog}
        isLoading={isLoading}
      />
      <RestaurantDialog
        isOpen={isRestaurantDialogOpen}
        setIsOpen={setIsRestaurantDialogOpen}
      />
      <DeleteRestaurantAlertDialog
        restaurant={deletingRestaurant!}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
