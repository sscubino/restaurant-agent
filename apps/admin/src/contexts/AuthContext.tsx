import { createContext, useContext, useEffect, useState } from "react";

import { isAuthenticated, removeToken } from "@/lib/auth-storage";

interface AuthContextType {
  isLoggedIn?: boolean;
  setIsLoggedIn: (value: boolean) => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("usePepe must be used within an AuthContext");
  }

  return authContext;
};

export const useGetAuthContext = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
  };
};
