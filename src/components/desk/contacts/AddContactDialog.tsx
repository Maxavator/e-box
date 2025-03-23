
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserPlus, Building } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const AddContactDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [externalFirstName, setExternalFirstName] = useState("");
  const [externalLastName, setExternalLastName] = useState("");
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

  const addExternalContactMutation = useMutation({
    mutationFn: async () => {
      // First, create a profile for the external contact
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      if (!externalFirstName || !externalLastName) {
        throw new Error("First name and last name are required");
      }

      // Create a new profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            first_name: externalFirstName, 
            last_name: externalLastName,
          }
        ])
        .select('id')
        .single();

      if (profileError) throw profileError;
      if (!newProfile) throw new Error("Failed to create profile");

      // Add the contact relationship
      const { error: contactError } = await supabase
        .from('contacts')
        .insert([
          { user_id: userData.user.id, contact_id: newProfile.id }
        ]);

      if (contactError) throw contactError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("External contact added successfully");
      setExternalFirstName("");
      setExternalLastName("");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to add external contact: " + error.message);
    }
  });

  const filteredMembers = organizationMembers.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    const firstName = (member.first_name || '').toLowerCase();
    const lastName = (member.last_name || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    
    return (
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Add a colleague from your organization or an external contact
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="colleagues" className="mt-2">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="colleagues" className="flex-1">
              <Building className="h-4 w-4 mr-2" />
              Colleagues
            </TabsTrigger>
            <TabsTrigger value="external" className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              External Contact
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="colleagues">
            <Input
              placeholder="Search organization members..."
              className="mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ScrollArea className="h-[300px]">
              {isLoadingMembers ? (
                <div className="text-center py-4">Loading members...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No matching members found
                </div>
              ) : (
                filteredMembers.map((member) => (
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
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Building className="h-3 w-3 mr-1" />
                        Colleague
                      </Badge>
                    </div>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="external">
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={externalFirstName}
                  onChange={(e) => setExternalFirstName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={externalLastName}
                  onChange={(e) => setExternalLastName(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => addExternalContactMutation.mutate()}
                disabled={!externalFirstName || !externalLastName}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add External Contact
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
