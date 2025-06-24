import { useEffect, useState } from "react";
import { toast } from "sonner";

import DeleteUserAlertDialog from "@/components/users/DeleteUserAlertDialog";
import UserDialog, { type UserFormData } from "@/components/users/UserDialog";
import { register } from "@/services/api/register";
import type { User } from "@/services/api/users";
import { deleteUser, getUsers } from "@/services/api/users";

import { UserTable } from "./UserTable";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: UserFormData) => {
    try {
      await register(userData);
      toast.success("User created successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleOpenCreateDialog = () => {
    setIsUserDialogOpen(true);
  };

  const handleOpenDeleteDialog = (userId: string) => {
    setIsDeleteDialogOpen(true);
    setDeletingUser(users.find((user) => user.id === userId)!);
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <>
      <UserTable
        users={users}
        handleDeleteUser={handleOpenDeleteDialog}
        handleCreateUser={handleOpenCreateDialog}
      />
      <UserDialog
        isOpen={isUserDialogOpen}
        setIsOpen={setIsUserDialogOpen}
        handleSubmit={handleCreateUser}
      />
      <DeleteUserAlertDialog
        user={deletingUser!}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDeleteUser={handleDeleteUser}
      />
    </>
  );
}
