
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Star, MoreVertical, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Contact } from "../types/contacts";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  searchQuery: string;
  onToggleFavorite: (contactId: string, isFavorite: boolean) => void;
}

export const ContactsTable = ({ contacts, isLoading, searchQuery, onToggleFavorite }: ContactsTableProps) => {
  const navigate = useNavigate();

  const filteredContacts = contacts?.filter(contact => {
    const fullName = `${contact.contact.first_name} ${contact.contact.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleStartChat = async (contactId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${userData.user.id},user2_id.eq.${contactId}),and(user1_id.eq.${contactId},user2_id.eq.${userData.user.id})`)
        .maybeSingle();

      if (existingConversation) {
        navigate(`/chat?conversation=${existingConversation.id}`);
        return;
      }

      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: userData.user.id,
          user2_id: contactId
        })
        .select('id')
        .single();

      if (error) throw error;
      
      navigate(`/chat?conversation=${newConversation.id}`);
    } catch (error) {
      toast.error("Failed to start conversation");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">Loading contacts...</TableCell>
          </TableRow>
        ) : filteredContacts?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No contacts found. Try adding some from your organization!
            </TableCell>
          </TableRow>
        ) : (
          filteredContacts?.map((contact) => (
            <TableRow key={contact.contact.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  {contact.contact.first_name} {contact.contact.last_name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Available
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => 
                      onToggleFavorite(contact.contact.id, !contact.is_favorite)
                    }>
                      <Star className={`mr-2 h-4 w-4 ${contact.is_favorite ? 'fill-yellow-400' : ''}`} />
                      {contact.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStartChat(contact.contact.id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
