import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateInviteCode } from "@/hooks/useInviteCodes";

const inviteCodeSchema = z.object({
  code: z.string().optional(),
  twilioPhoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(validator.isMobilePhone, "Invalid phone number"),
});

export type InviteCodeFormData = z.infer<typeof inviteCodeSchema>;

interface InviteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const InviteDialog = ({ isOpen, setIsOpen }: InviteDialogProps) => {
  const { mutateAsync: createInviteCode } = useCreateInviteCode();

  const form = useForm<InviteCodeFormData>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: {
      code: "",
      twilioPhoneNumber: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: InviteCodeFormData) => {
    createInviteCode(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  };

  const submitText = form.formState.isSubmitting ? "Creating..." : "Create";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Invite Code</DialogTitle>
          <DialogDescription>
            Add a new invite code to the system. The code will be auto-generated
            if not provided.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leave empty for auto-generation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twilioPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twilio Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
