import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { RoutePaths } from "@/config/types";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { getAxiosErrorMessage } from "@/lib/utils";
import { login } from "@/services/api/login";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthContext();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      setIsLoggedIn(true);
      navigate(RoutePaths.HOME);
    },
    onError: (error: unknown) => {
      const errorMessage = getAxiosErrorMessage(error);
      throw new Error(errorMessage);
    },
  });
};
