import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/hooks/useUsers";
import type { User } from "@/services/api/users";

interface DeleteUserAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user?: User;
}

const DeleteUserAlertDialog = ({
  isOpen,
  setIsOpen,
  user,
}: DeleteUserAlertDialogProps) => {
  const deleteUser = useDeleteUser();

  const handleDelete = () => {
    deleteUser.mutate(user!.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>{" "}
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserAlertDialog;
