
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Define a Profile type for this component since we need it here
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string;
  organization_id: string | null;
}

export function NewMessageDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['organization-contacts'],
    queryFn: async () => {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', currentUser.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('User not in organization');
      }

      const { data: orgContacts, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, organization_id')
        .eq('organization_id', profile.organization_id)
        .neq('id', currentUser.id);

      if (error) throw error;
      return orgContacts || [];
    }
  });

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  const handleSelectContact = async (contact: Profile) => {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Not authenticated');

      // Check if conversation already exists using interpolated values safely
      const { data: existingConvs, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${contact.id},user2_id.eq.${contact.id}`)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingConvs) {
        toast({
          title: "Conversation exists",
          description: "You already have a conversation with this contact"
        });
        return;
      }

      // Create new conversation
      const { error: insertError } = await supabase
        .from('conversations')
        .insert({
          user1_id: currentUser.id,
          user2_id: contact.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Conversation started",
        description: `Started a new conversation with ${contact.first_name} ${contact.last_name}`
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Pen className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-4">
                  Loading contacts...
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No contacts found
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {contact.avatar_url ? (
                          <AvatarImage src={contact.avatar_url} alt={`${contact.first_name} ${contact.last_name}`} />
                        ) : (
                          <AvatarFallback>
                            {`${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {`${contact.first_name} ${contact.last_name}`}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
