import api from "@/lib/api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperUser: boolean;
  restaurant?: Restaurant;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/api/users");
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};
