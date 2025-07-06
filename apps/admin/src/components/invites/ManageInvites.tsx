import { useState } from "react";

import DeleteInviteAlertDialog from "@/components/invites/DeleteInviteAlertDialog";
import InviteDialog from "@/components/invites/InviteDialog";
import InvitesTable from "@/components/invites/InvitesTable";
import { useInviteCodes } from "@/hooks/useInviteCodes";
import { getInviteLink } from "@/lib/invite-link";

export default function ManageInvites() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);

  const { data: inviteCodes = [], isLoading } = useInviteCodes();

  const handleOpenCreateDialog = () => {
    setIsInviteDialogOpen(true);
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
