import api from "@/lib/api";
import type { User } from "@/services/api/users";

export interface InviteCode {
  id: string;
  code: string;
  twilioPhoneNumber: string;
  isUsed: boolean;
  usedBy: User;
  usedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteCodeDto {
  code?: string;
  twilioPhoneNumber: string;
}

export const getInviteCodes = async (): Promise<InviteCode[]> => {
  const response = await api.get("/invite-codes");
  return response.data;
};

export const createInviteCode = async (
  inviteCode: InviteCodeDto
): Promise<InviteCode> => {
  const response = await api.post("/invite-codes", inviteCode);
  return response.data;
};

export const deleteInviteCode = async (id: string): Promise<void> => {
  await api.delete(`/invite-codes/${id}`);
};
