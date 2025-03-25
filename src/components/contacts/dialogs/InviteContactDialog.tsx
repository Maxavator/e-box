
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";

interface InviteContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: () => void;
  searchType: "email" | "mobile" | "saId";
  initialValue: string;
}

// Validation schema based on search type
const getValidationSchema = (searchType: string) => {
  const baseSchema = {
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    consentGiven: z.boolean().refine(val => val === true, {
      message: "You must agree to the POPIA consent terms"
    })
  };

  if (searchType === "email") {
    return z.object({
      ...baseSchema,
      email: z.string().email("Please enter a valid email address")
    });
  } else if (searchType === "mobile") {
    return z.object({
      ...baseSchema,
      mobile: z.string().min(10, "Please enter a valid mobile number")
    });
  } else if (searchType === "saId") {
    return z.object({
      ...baseSchema,
      saId: z.string().refine(val => isSaId(val), {
        message: "Please enter a valid 13-digit SA ID number"
      })
    });
  }

  return z.object(baseSchema);
};

export const InviteContactDialog = ({ 
  isOpen, 
  onClose, 
  onInviteSent, 
  searchType,
  initialValue 
}: InviteContactDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create the form
  const form = useForm<any>({
    resolver: zodResolver(getValidationSchema(searchType)),
    defaultValues: {
      firstName: "",
      lastName: "",
      consentGiven: false,
      ...(searchType === "email" ? { email: initialValue } : {}),
      ...(searchType === "mobile" ? { mobile: initialValue } : {}),
      ...(searchType === "saId" ? { saId: initialValue } : {})
    }
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Create an invitation record
      const { error: inviteError } = await supabase
        .from('contact_invites')
        .insert({
          inviter_id: userData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email || null,
          mobile_number: data.mobile || null,
          sa_id: data.saId || null,
          status: 'pending',
          popia_consent: data.consentGiven
        });
      
      if (inviteError) {
        throw inviteError;
      }
      
      // Success
      toast.success(`Invitation sent to ${data.firstName} ${data.lastName}`);
      onInviteSent();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast.error(`Failed to send invitation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite New Contact</DialogTitle>
          <DialogDescription>
            Send an invitation to connect with someone not yet on the platform.
            This complies with POPIA regulations.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {searchType === "email" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {searchType === "mobile" && (
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {searchType === "saId" && (
              <FormField
                control={form.control}
                name="saId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SA ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="13-digit SA ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="consentGiven"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      POPIA Consent
                    </FormLabel>
                    <FormDescription className="text-xs">
                      I confirm I have the person's consent to invite them to connect,
                      and their information will be processed according to POPIA regulations.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
