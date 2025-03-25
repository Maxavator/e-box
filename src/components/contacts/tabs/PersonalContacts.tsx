
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyContacts } from "../components/EmptyContacts";
import { InviteContactDialog } from "../dialogs/InviteContactDialog";
import { Eye, Star, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for personal contacts
const mockContacts = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+27 82 123 4567",
    status: "Available",
    favorite: true,
    connection: "direct",
    avatar: null, // Will use initials
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+27 71 234 5678",
    status: "Busy",
    favorite: false,
    connection: "pending",
    avatar: "/avatars/sarah.jpg",
    lastActive: "Yesterday"
  }
];

export const PersonalContacts = () => {
  const [contacts] = useState(mockContacts);
  const [loading] = useState(false);
  
  const handleInviteSuccess = () => {
    // This would typically refresh the contacts list
    console.log("Invite sent successfully");
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading contacts...</div>;
  }
  
  if (contacts.length === 0) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <InviteContactDialog onInviteSuccess={handleInviteSuccess} />
        </div>
        <EmptyContacts type="personal" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Personal Contacts ({contacts.length})</h3>
        <InviteContactDialog onInviteSuccess={handleInviteSuccess} />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Connection</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar || ""} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        {contact.name}
                        {contact.favorite && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active: {contact.lastActive}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{contact.email}</div>
                    <div>{contact.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={contact.status === "Available" ? "default" : "outline"}>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={contact.connection === "direct" ? "default" : "secondary"}>
                    {contact.connection === "direct" ? "Connected" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
