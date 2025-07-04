import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { register, type RegisterUserData } from "@/services/api/register";
import { deleteRestaurant, getRestaurants } from "@/services/api/restaurants";

// Query keys
export const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters: string) => [...restaurantKeys.lists(), { filters }] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
};

// Get restaurants query
export const useRestaurants = () => {
  return useQuery({
    queryKey: restaurantKeys.lists(),
    queryFn: getRestaurants,
  });
};

// Create restaurant mutation
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterUserData) => register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
      toast.success("Restaurant deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete restaurant");
      console.error("Error deleting restaurant:", error);
    },
  });
};
