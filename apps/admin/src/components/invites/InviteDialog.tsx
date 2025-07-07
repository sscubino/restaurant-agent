import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  const {
    mutateAsync: createInviteCode,
    isSuccess,
    reset,
  } = useCreateInviteCode();
  const [createdInviteCode, setCreatedInviteCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm<InviteCodeFormData>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: {
      code: "",
      twilioPhoneNumber: "",
    },
    mode: "onSubmit",
  });

  const getInviteLink = (inviteCode: string) => {
    return `${import.meta.env.VITE_FRONTEND_URL}/register?inviteCode=${inviteCode}`;
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(getInviteLink(createdInviteCode));
      setCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy invite link");
    }
  };

  const onSubmit = (data: InviteCodeFormData) => {
    createInviteCode(data, {
      onSuccess: (response) => {
        setCreatedInviteCode(response.code);
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedInviteCode("");
    setCopied(false);
    reset();
    form.reset();
  };

  const handleCreateAnother = () => {
    setCreatedInviteCode("");
    setCopied(false);
    reset();
    form.reset();
  };

  const submitText = form.formState.isSubmitting ? "Creating..." : "Create";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Create New Invite Code</DialogTitle>
              <DialogDescription>
                Add a new invite code to the system. The code will be
                auto-generated if not provided.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-600 dark:text-green-400">
                Invite Code Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Your invite code has been created. Share this link with the
                restaurant owner to allow them to register.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Invite Link</label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={getInviteLink(createdInviteCode)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyInviteLink}
                    className="shrink-0 h-9"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Invite Code</label>
                <Input
                  value={createdInviteCode}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
              <Button variant="outline" onClick={handleCreateAnother}>
                Create Another
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
