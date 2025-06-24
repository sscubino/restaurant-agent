import api from "@/lib/api";

export interface RegisterUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  companyName: string;
  companyPhone: string;
}

export const register = async (userData: RegisterUserData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};
