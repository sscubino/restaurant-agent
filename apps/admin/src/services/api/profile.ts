import api from "@/lib/api";
import type { User } from "@/services/api/users";

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data;
};
