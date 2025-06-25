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
import { useDeleteRestaurant } from "@/hooks/useRestaurants";
import type { Restaurant } from "@/services/api/restaurants";

interface DeleteRestaurantAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  restaurant?: Restaurant;
}

const DeleteRestaurantAlertDialog = ({
  isOpen,
  setIsOpen,
  restaurant,
}: DeleteRestaurantAlertDialogProps) => {
  const deleteRestaurant = useDeleteRestaurant();

  const handleDelete = () => {
    deleteRestaurant.mutate(restaurant!.id, {
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
            <strong>{restaurant?.name}</strong> and remove their data from our
            servers.
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

export default DeleteRestaurantAlertDialog;
