import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createUser,
  type CreateUserDto,
  deleteUser,
  getUsers,
} from "@/services/api/users";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
};

// Get users query
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User created successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    },
  });
};
