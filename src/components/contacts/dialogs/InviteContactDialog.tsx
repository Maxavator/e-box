
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Search } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  searchValue: z.string().min(3, "Please enter at least 3 characters"),
  searchType: z.enum(["email", "saId", "phone"]),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface InviteContactDialogProps {
  onInviteSuccess: () => void;
  // Optional props for when used from SearchContactForm
  initialValue?: string;
  searchType?: "email" | "saId" | "mobile";
  onClose?: () => void;
  onInviteSent?: () => void;
}

export const InviteContactDialog = ({ 
  onInviteSuccess, 
  initialValue = "", 
  searchType: initialSearchType = "email",
  onClose,
  onInviteSent
}: InviteContactDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert mobile to phone for the form
  const convertedSearchType = initialSearchType === "mobile" ? "phone" : initialSearchType;
  
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchValue: initialValue,
      searchType: convertedSearchType,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  const onSubmit = async (data: SearchFormValues) => {
    try {
      // Simulate API call
      console.log("Searching for contact:", data);
      
      // Simulate not finding the contact and sending an invitation
      setTimeout(() => {
        toast.success("Invitation sent successfully!");
        setIsOpen(false);
        form.reset();
        onInviteSuccess();
        
        if (onInviteSent) {
          onInviteSent();
        }
      }, 1500);
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Mail className="h-3.5 w-3.5" />
          <span>Invite Contact</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite a Contact</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="searchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search by</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <div className="flex">
                        <Button
                          type="button"
                          variant={field.value === "email" ? "default" : "outline"}
                          onClick={() => field.onChange("email")}
                          className="rounded-r-none"
                        >
                          Email
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "saId" ? "default" : "outline"}
                          onClick={() => field.onChange("saId")}
                          className="rounded-none border-x-0"
                        >
                          SA ID Number
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "phone" ? "default" : "outline"}
                          onClick={() => field.onChange("phone")}
                          className="rounded-l-none"
                        >
                          Phone
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select how you want to search for your contact
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="searchValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {field.value === "email" ? "Email Address" : 
                     field.value === "saId" ? "SA ID Number" : "Phone Number"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-8" placeholder="Enter search term" {...field} />
                    </div>
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    {field.value === "email" ? "Format: name@example.com" : 
                     field.value === "saId" ? "Format: 13-digit SA ID number" : "Format: 10-digit phone number"}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Search & Invite
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
