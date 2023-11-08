import { useCreateOrgInvitationMutation } from "~/graphql/hooks/mutations";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormItem,
  FormControl,
  Input,
  FormField,
  FormMessage,
  FormLabel,
  Alert,
  AlertTitle,
  AlertDescription,
  toast,
} from "@pezzo/ui";
import { AlertCircle } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  inviteeEmail: z
    .string()
    .email("Must be a valid email")
    .max(100, "Email can't be longer than 100 characters"),
});

export const InviteOrgMemberModal = ({ open, onClose }: Props) => {
  const { organization } = useCurrentOrganization({
    includeMembers: true,
    includeInvitations: false,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteeEmail: "",
    },
  });
  const { mutateAsync: createInvitation, error } =
    useCreateOrgInvitationMutation();

  useEffect(() => {
    form.reset();
  }, [open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { inviteeEmail } = values;

    createInvitation(
      { email: inviteeEmail, organizationId: organization.id },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: "Invitation sent",
            description: `An invitation has been sent to ${inviteeEmail}`,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onPointerDownOutside={onClose}
        className="sm:max-w-[425px]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-2">Invite a new member</DialogTitle>
              <DialogDescription>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>
                      {error.response.errors[0].message}
                    </AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="inviteeEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
