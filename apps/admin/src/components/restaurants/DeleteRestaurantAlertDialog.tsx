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
import type { Restaurant } from "@/services/api/restaurants";

interface DeleteRestaurantAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  restaurant?: Restaurant;
  handleDeleteRestaurant: (restaurantId: string) => void;
}

const DeleteRestaurantAlertDialog = ({
  isOpen,
  setIsOpen,
  restaurant,
  handleDeleteRestaurant,
}: DeleteRestaurantAlertDialogProps) => {
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
          <AlertDialogAction
            onClick={() => handleDeleteRestaurant(restaurant!.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRestaurantAlertDialog;
