import api from "@/lib/api";
import type { Restaurant } from "@/services/api/restaurants";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperUser: boolean;
  lastLogin: string | null;
  restaurant?: Omit<Restaurant, "user">;
  polarCustomer?: PolarCustomer;
  createdAt: string;
  updatedAt: string;
}

export interface PolarCustomer {
  id: string;
  subscriptions: PolarSubscription[];
  createdAt: string;
  updatedAt: string;
}

export interface PolarSubscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSuperUser: boolean;
}

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
