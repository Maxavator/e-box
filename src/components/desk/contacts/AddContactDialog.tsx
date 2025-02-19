
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useOrganizationMembers } from "./useOrganizationMembers";

export const AddContactDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { organizationMembers, isLoadingMembers } = useOrganizationMembers();

  const addContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('contacts')
        .insert([
          { user_id: userData.user.id, contact_id: contactId }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("Contact added successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to add contact: " + error.message);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search organization members..."
            className="mb-4"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ScrollArea className="h-[300px]">
            {isLoadingMembers ? (
              <div className="text-center py-4">Loading members...</div>
            ) : (
              organizationMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => addContactMutation.mutate(member.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span>{member.first_name} {member.last_name}</span>
                  </div>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
