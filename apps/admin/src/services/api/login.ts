import api from "@/lib/api";
import { setToken } from "@/lib/auth-storage";
import type { User } from "@/services/api/users";

export interface LoginResponse {
  user: User;
  access_token: string;
}

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/auth/login", { email, password });
  setToken(response.data.access_token);
  return response.data;
};
