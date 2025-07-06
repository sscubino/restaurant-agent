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
import { useDeleteInviteCode } from "@/hooks/useInviteCodes";
import type { InviteCode } from "@/services/api/invite-codes";

interface DeleteInviteAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invite?: InviteCode | null;
}

const DeleteInviteAlertDialog = ({
  isOpen,
  setIsOpen,
  invite,
}: DeleteInviteAlertDialogProps) => {
  const deleteInviteCode = useDeleteInviteCode();

  const handleDelete = () => {
    deleteInviteCode.mutate(invite!.id, {
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
            This action cannot be undone. This will permanently delete the
            invite code <strong>{invite?.code}</strong> and remove it from our
            servers.
            {invite?.isUsed && (
              <span className="block mt-2 text-accent-foreground">
                Warning: This invite code has already been used by{" "}
                {invite.usedBy?.email}.
              </span>
            )}
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

export default DeleteInviteAlertDialog;
