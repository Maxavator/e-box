
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  MessageSquare, 
  Trash, 
  UserRoundPlus, 
  Users, 
  Star,
  UserCog
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyContacts } from "../components/EmptyContacts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useContacts } from "../../desk/contacts/useContacts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const PersonalContacts = () => {
  const { contacts = [], isLoading } = useContacts();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  
  const personalContacts = contacts.filter(contact => 
    // Filter logic for personal contacts - adapt to your data structure
    !contact.is_colleague && contact.contact && 
    (contact.contact.first_name || contact.contact.last_name)
  );
  
  const filteredContacts = personalContacts.filter(contact => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    const firstName = (contact.contact?.first_name || "").toLowerCase();
    const lastName = (contact.contact?.last_name || "").toLowerCase();
    
    return firstName.includes(searchLower) || lastName.includes(searchLower);
  });
  
  const handleStartChat = (contactId: string) => {
    navigate(`/chat?contact=${contactId}`);
  };
  
  const handleManageGroups = (contactId: string) => {
    toast.info("Group management will be implemented soon");
  };
  
  const handleSetFavorite = (contactId: string, isFavorite: boolean) => {
    toast.success(`Contact ${isFavorite ? 'added to' : 'removed from'} favorites`);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (personalContacts.length === 0) {
    return <EmptyContacts type="personal" />;
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Groups</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={contact.contact?.avatar_url || undefined} />
                    <AvatarFallback>
                      {contact.contact?.first_name?.charAt(0) || "U"}
                      {contact.contact?.last_name?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {contact.contact?.first_name} {contact.contact?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {contact.is_favorite && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 mr-2">
                          Favorite
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Friends
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStartChat(contact.contact.id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetFavorite(contact.contact.id, !contact.is_favorite)}>
                      <Star className={`mr-2 h-4 w-4 ${contact.is_favorite ? 'fill-yellow-400' : ''}`} />
                      {contact.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageGroups(contact.contact.id)}>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Groups
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCog className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Remove Contact
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
