import { useState } from "react";

import DeleteUserAlertDialog from "@/components/users/DeleteUserAlertDialog";
import UserDialog from "@/components/users/UserDialog";
import { useUsers } from "@/hooks/useUsers";

import { UserTable } from "./UserTable";

export default function ManageUsers() {
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: users = [], isLoading } = useUsers();

  const handleOpenCreateDialog = () => {
    setIsUserDialogOpen(true);
  };

  const handleOpenDeleteDialog = (userId: string) => {
    setIsDeleteDialogOpen(true);
    setDeletingUserId(userId);
  };

  const deletingUser = users.find((u) => u.id === deletingUserId) || null;

  return (
    <>
      <UserTable
        users={users}
        handleDeleteUser={handleOpenDeleteDialog}
        handleCreateUser={handleOpenCreateDialog}
        isLoading={isLoading}
      />
      <UserDialog isOpen={isUserDialogOpen} setIsOpen={setIsUserDialogOpen} />
      <DeleteUserAlertDialog
        user={deletingUser!}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
