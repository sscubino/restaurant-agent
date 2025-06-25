import { useEffect, useState } from "react";
import { toast } from "sonner";

import DeleteRestaurantAlertDialog from "@/components/restaurants/DeleteRestaurantAlertDialog";
import RestaurantDialog from "@/components/restaurants/RestaurantDialog";
import { RestaurantsTable } from "@/components/restaurants/RestaurantsTable";
import {
  deleteRestaurant,
  getRestaurants,
  type Restaurant,
} from "@/services/api/restaurants";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingRestaurant, setDeletingRestaurant] =
    useState<Restaurant | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const fetchedRestaurants = await getRestaurants();
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantCreated = () => {
    loadRestaurants();
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    try {
      await deleteRestaurant(restaurantId);
      setRestaurants(
        restaurants.filter((restaurant) => restaurant.id !== restaurantId)
      );
      toast.success("Restaurant deleted successfully");
    } catch (error) {
      toast.error("Failed to delete restaurant");
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleOpenCreateDialog = () => {
    setIsRestaurantDialogOpen(true);
  };

  const handleOpenDeleteDialog = (restaurantId: string) => {
    setIsDeleteDialogOpen(true);
    setDeletingRestaurant(
      restaurants.find((restaurant) => restaurant.id === restaurantId)!
    );
  };

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
        handleRestaurantCreated={handleRestaurantCreated}
      />
      <DeleteRestaurantAlertDialog
        restaurant={deletingRestaurant!}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDeleteRestaurant={handleDeleteRestaurant}
      />
    </>
  );
}
