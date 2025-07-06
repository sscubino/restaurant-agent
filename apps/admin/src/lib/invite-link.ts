export const getInviteLink = (inviteCode: string) => {
  return `${import.meta.env.VITE_FRONTEND_URL}/register?inviteCode=${inviteCode}`;
};
