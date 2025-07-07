import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import DeleteInviteAlertDialog from "@/components/invites/DeleteInviteAlertDialog";
import InviteDialog from "@/components/invites/InviteDialog";
import InvitesTable from "@/components/invites/InvitesTable";
import { useInviteCodes } from "@/hooks/useInviteCodes";

export default function ManageInvites() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);
  const location = useLocation();

  const { data: inviteCodes = [], isLoading } = useInviteCodes();

  useEffect(() => {
    if (location.state?.create) {
      setIsInviteDialogOpen(true);
    }
  }, [location.state?.create]);

  const handleOpenCreateDialog = () => {
    setIsInviteDialogOpen(true);
  };

  const getInviteLink = (inviteCode: string) => {
    return `${import.meta.env.VITE_FRONTEND_URL}/register?inviteCode=${inviteCode}`;
  };

  const handleCopyInviteLink = (inviteCode: string) => {
    navigator.clipboard.writeText(getInviteLink(inviteCode));
  };

  const handleOpenDeleteDialog = (inviteId: string) => {
    setIsDeleteDialogOpen(true);
    setDeletingInviteId(inviteId);
  };

  const handleCloseDialog = () => {
    setIsInviteDialogOpen(false);
  };

  const deletingInvite =
    inviteCodes.find((i) => i.id === deletingInviteId) || null;

  return (
    <>
      <InvitesTable
        inviteCodes={inviteCodes}
        handleCopyInviteLink={handleCopyInviteLink}
        handleDeleteInvite={handleOpenDeleteDialog}
        handleCreateInvite={handleOpenCreateDialog}
        isLoading={isLoading}
      />
      <InviteDialog isOpen={isInviteDialogOpen} setIsOpen={handleCloseDialog} />
      <DeleteInviteAlertDialog
        invite={deletingInvite}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
