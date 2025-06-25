import api from "@/lib/api";
import type { User } from "@/services/api/users";

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  user: Omit<User, "restaurant">;
  createdAt: string;
  updatedAt: string;
}

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const response = await api.get("/admin/restaurant-user");
  return response.data;
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  await api.delete(`/admin/restaurant-user/${id}`);
};
