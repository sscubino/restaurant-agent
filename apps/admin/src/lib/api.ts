import axios from "axios";

import { RoutePaths } from "@/config/types";
import { getToken, removeToken } from "@/lib/auth-storage";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeToken();
      if (window.location.pathname !== RoutePaths.LOGIN) {
        window.location.href = RoutePaths.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
