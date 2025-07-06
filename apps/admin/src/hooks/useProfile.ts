import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/services/api/profile";

export const useProfile = () => {
  return useQuery({ queryKey: ["profile"], queryFn: getProfile });
};
