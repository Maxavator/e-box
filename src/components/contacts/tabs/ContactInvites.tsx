
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MailCheck, MailQuestion, MailX, RefreshCw, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmptyContacts } from "../components/EmptyContacts";

type Invite = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  mobile_number: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
};

export const ContactInvites = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadInvites = async () => {
    try {
      setIsLoading(true);
      
      // Mock data load - replace with actual API call
      // For demo purposes, we're setting mock data
      setTimeout(() => {
        const mockInvites: Invite[] = [
          {
            id: "1",
            first_name: "John",
            last_name: "Smith",
            email: "john.smith@example.com",
            mobile_number: null,
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            id: "2",
            first_name: "Mary",
            last_name: "Johnson",
            email: null,
            mobile_number: "0761234567",
            status: 'accepted',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
          },
          {
            id: "3",
            first_name: "Robert",
            last_name: "Williams",
            email: "robert@example.com",
            mobile_number: null,
            status: 'declined',
            created_at: new Date(Date.now() - 3600000 * 72).toISOString()
          }
        ];
        
        setInvites(mockInvites);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error loading invites:", error);
      toast.error("Failed to load invites");
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadInvites();
  }, [activeTab]);
  
  const handleResendInvite = (inviteId: string) => {
    toast.success("Invitation resent successfully");
  };
  
  const handleCancelInvite = (inviteId: string) => {
    toast.success("Invitation cancelled successfully");
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const sentInvites = invites.filter(invite => invite.status === 'pending');
  const acceptedInvites = invites.filter(invite => invite.status === 'accepted');
  const declinedInvites = invites.filter(invite => invite.status === 'declined');
  
  const getContactInfo = (invite: Invite) => {
    if (invite.email) return invite.email;
    if (invite.mobile_number) return invite.mobile_number;
    return "No contact info";
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading invites...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Invitations</CardTitle>
          <CardDescription>
            Track and manage invitations you've sent to contacts. Invitations expire after 7 days if not accepted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <MailQuestion className="h-4 w-4" />
                <span>Pending ({sentInvites.length})</span>
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <MailCheck className="h-4 w-4" />
                <span>Accepted ({acceptedInvites.length})</span>
              </TabsTrigger>
              <TabsTrigger value="declined" className="flex items-center gap-2">
                <MailX className="h-4 w-4" />
                <span>Declined ({declinedInvites.length})</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Sent Invites */}
            <TabsContent value="sent">
              {sentInvites.length === 0 ? (
                <EmptyContacts type="invites" subtype="pending" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentInvites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User2 className="h-4 w-4 text-primary" />
                            </div>
                            {invite.first_name} {invite.last_name}
                          </div>
                        </TableCell>
                        <TableCell>{getContactInfo(invite)}</TableCell>
                        <TableCell>{formatDate(invite.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(invite.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResendInvite(invite.id)}
                            >
                              <Mail className="h-3 w-3 mr-1" /> Resend
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => handleCancelInvite(invite.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            {/* Accepted Invites */}
            <TabsContent value="accepted">
              {acceptedInvites.length === 0 ? (
                <EmptyContacts type="invites" subtype="accepted" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Accepted Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acceptedInvites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User2 className="h-4 w-4 text-primary" />
                            </div>
                            {invite.first_name} {invite.last_name}
                          </div>
                        </TableCell>
                        <TableCell>{getContactInfo(invite)}</TableCell>
                        <TableCell>{formatDate(invite.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(invite.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            {/* Declined Invites */}
            <TabsContent value="declined">
              {declinedInvites.length === 0 ? (
                <EmptyContacts type="invites" subtype="declined" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Declined Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {declinedInvites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User2 className="h-4 w-4 text-primary" />
                            </div>
                            {invite.first_name} {invite.last_name}
                          </div>
                        </TableCell>
                        <TableCell>{getContactInfo(invite)}</TableCell>
                        <TableCell>{formatDate(invite.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(invite.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResendInvite(invite.id)}
                          >
                            <Mail className="h-3 w-3 mr-1" /> Try Again
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
