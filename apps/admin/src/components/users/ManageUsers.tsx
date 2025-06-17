import { useState } from "react";

import DeleteUserAlertDialog from "@/components/users/DeleteUserAlertDialog";
import UserDialog, { type UserFormData } from "@/components/users/UserDialog";

import { UserTable } from "./UserTable";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phone: string;
  creationDate: string;
}

const initialUsers: User[] = [];

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleCreateUser = (user: UserFormData) => {
    const newUser: User = {
      id: Date.now().toString(),
      creationDate: new Date().toISOString(),
      ...user,
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...editingUser, ...updatedUser } : user
        )
      );
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setEditingUser(null);
    setIsUserDialogOpen(true);
  };

  const handleOpenEditUserDialog = (user: User) => {
    setDialogMode("update");
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handleUserDialogSubmit = (data: UserFormData | User) => {
    if (dialogMode === "create") {
      handleCreateUser(data as UserFormData);
    } else {
      handleUpdateUser(data as User);
    }
  };

  const handleOpenDeleteDialog = (userId: string) => {
    setIsDeleteDialogOpen(true);
    setEditingUser(users.find((user) => user.id === userId)!);
  };

  return (
    <>
      <UserTable
        users={users}
        handleEditUser={handleOpenEditUserDialog}
        handleDeleteUser={handleOpenDeleteDialog}
        handleCreateUser={handleOpenCreateDialog}
      />
      <UserDialog
        mode={dialogMode}
        user={editingUser || undefined}
        isOpen={isUserDialogOpen}
        setIsOpen={setIsUserDialogOpen}
        handleSubmit={handleUserDialogSubmit}
      />
      <DeleteUserAlertDialog
        user={editingUser!}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDeleteUser={handleDeleteUser}
      />
    </>
  );
}
