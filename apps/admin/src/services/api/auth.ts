import api from "@/lib/api";
import { setToken } from "@/lib/auth-storage";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/auth/login", { email, password });
  setToken(response.data.access_token);
};
