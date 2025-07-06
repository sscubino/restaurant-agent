import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodes,
  type InviteCodeDto,
} from "@/services/api/invite-codes";

// Query keys
export const inviteCodeKeys = {
  all: ["invite-codes"] as const,
  list: () => [...inviteCodeKeys.all, "list"] as const,
};

// Get invite codes query
export const useInviteCodes = () => {
  return useQuery({
    queryKey: inviteCodeKeys.list(),
    queryFn: getInviteCodes,
  });
};

// Create invite code mutation
export const useCreateInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteDto: InviteCodeDto) => createInviteCode(inviteDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inviteCodeKeys.list() });
      toast.success("Invite code created successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to create invite code");
      console.error("Error creating invite code:", error);
    },
  });
};

// Delete invite code mutation
export const useDeleteInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInviteCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inviteCodeKeys.list() });
      toast.success("Invite code deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete invite code");
      console.error("Error deleting invite code:", error);
    },
  });
};
