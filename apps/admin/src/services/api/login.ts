import api from "@/lib/api";
import { setToken } from "@/lib/auth-storage";
import type { User } from "@/services/api/users";

export interface LoginResponse {
  user: User;
  access_token: string;
}

export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  if (!response.data.user.isSuperUser) {
    throw new Error("Unauthorized");
  }
  setToken(response.data.access_token);
  return response.data;
};
