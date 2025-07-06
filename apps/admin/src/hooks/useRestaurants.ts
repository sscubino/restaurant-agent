import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createRestaurant,
  type CreateRestaurantUserData,
  deleteRestaurant,
  getRestaurants,
} from "@/services/api/restaurants";

// Query keys
export const restaurantKeys = {
  all: ["restaurants"] as const,
  list: () => [...restaurantKeys.all, "list"] as const,
};

// Get restaurants query
export const useRestaurants = () => {
  return useQuery({
    queryKey: restaurantKeys.list(),
    queryFn: getRestaurants,
  });
};

// Create restaurant mutation
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateRestaurantUserData) =>
      createRestaurant(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.list() });
      toast.success("Restaurant created successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to create restaurant");
      console.error("Error creating restaurant:", error);
    },
  });
};

// Delete restaurant mutation
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.list() });
      toast.success("Restaurant deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete restaurant");
      console.error("Error deleting restaurant:", error);
    },
  });
};
