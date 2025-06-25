import api from "@/lib/api";
import type { User } from "@/services/api/users";

export interface RegisterUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  companyName: string;
  companyPhone: string;
}

export const register = async (userData: RegisterUserData): Promise<User> => {
  const response = await api.post("/admin/restaurant-user", userData);
  return response.data;
};
