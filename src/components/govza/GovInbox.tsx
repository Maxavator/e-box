import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  File,
  FileCheck,
  Flag,
  Inbox as InboxIcon,
  Mail,
  MoreHorizontal,
  Reply,
  Search,
  Send,
  Star,
  Trash2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

// Type definitions
interface GovMessage {
  id: string;
  recipient_said: string;
  subject: string;
  content: string;
  sender_department: string;
  read: boolean;
  important: boolean;
  category: string;
  reference_number: string | null;
  created_at: string;
  expires_at: string | null;
  attachments: any[] | null;
}

export const GovInbox = () => {
  const [messages, setMessages] = useState<GovMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<GovMessage | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [userSaid, setUserSaid] = useState<string | null>(null);

  // Fetch user SA ID
  useEffect(() => {
    const fetchUserSaid = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('sa_id')
          .eq('id', user.id)
          .single();
        
        if (profile?.sa_id) {
          setUserSaid(profile.sa_id);
        }
      }
    };

    fetchUserSaid();
  }, []);

  // Fetch messages based on the user's SA ID
  useEffect(() => {
    if (!userSaid) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('gov_messages')
          .select('*')
          .eq('recipient_said', userSaid)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching government messages:', error);
        toast.error('Failed to load government messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('gov-messages-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'gov_messages',
          filter: `recipient_said=eq.${userSaid}`
        }, 
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as GovMessage, ...prev]);
            toast.info('New government message received!');
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => msg.id === payload.new.id ? payload.new as GovMessage : msg)
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userSaid]);

  // Handle message selection and marking as read
  const handleSelectMessage = async (message: GovMessage) => {
    setSelectedMessage(message);
    setIsMessageOpen(true);
    
    // Mark as read if not already read
    if (!message.read) {
      try {
        const { error } = await supabase
          .from('gov_messages')
          .update({ read: true })
          .eq('id', message.id);
          
        if (error) throw error;
        
        // Update local state
        setMessages(prev => 
          prev.map(msg => msg.id === message.id ? { ...msg, read: true } : msg)
        );
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  // Handle reply submission
  const handleSubmitReply = async () => {
    if (!selectedMessage || !replyContent.trim() || !userSaid) return;
    
    setIsReplying(true);
    try {
      // Store the reply in a new table that we would create for government replies
      const { error } = await supabase
        .from('gov_message_replies')
        .insert({
          original_message_id: selectedMessage.id,
          sender_said: userSaid,
          content: replyContent,
          department: selectedMessage.sender_department
        });
        
      if (error) {
        if (error.code === '42P01') {  // Table doesn't exist yet
          toast.error('The reply functionality is not fully set up yet.');
        } else {
          throw error;
        }
      } else {
        toast.success('Your reply has been submitted successfully!');
        setReplyContent('');
        setIsReplying(false);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit your reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  // Filter messages based on active tab and search query
  const getFilteredMessages = () => {
    let filtered = [...messages];
    
    // Apply tab filter
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(m => !m.read);
        break;
      case 'important':
        filtered = filtered.filter(m => m.important);
        break;
      case 'transport':
        filtered = filtered.filter(m => m.category === 'transport');
        break;
      case 'identity':
        filtered = filtered.filter(m => m.category === 'identity');
        break;
      case 'tax':
        filtered = filtered.filter(m => m.category === 'tax');
        break;
      case 'grants':
        filtered = filtered.filter(m => m.category === 'grants');
        break;
      case 'municipal':
        filtered = filtered.filter(m => m.category === 'municipal');
        break;
      default:
        break;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.subject.toLowerCase().includes(query) ||
        m.content.toLowerCase().includes(query) ||
        m.sender_department.toLowerCase().includes(query) ||
        (m.reference_number && m.reference_number.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Count messages for badges
  const unreadCount = messages.filter(m => !m.read).length;
  const importantCount = messages.filter(m => m.important).length;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If it's today, just show the time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // If it's this year, show date without year
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'd MMM');
    }
    
    // Otherwise show full date
    return format(date, 'd MMM yyyy');
  };

  // Toggle important flag
  const toggleImportant = async (messageId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('gov_messages')
        .update({ important: !currentValue })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, important: !currentValue } : msg)
      );
      
      toast.success(currentValue ? 'Removed from important' : 'Marked as important');
    } catch (error) {
      console.error('Error toggling important flag:', error);
      toast.error('Failed to update message');
    }
  };

  // Archive message
  const archiveMessage = async (messageId: string) => {
    // In a real implementation, we would have an archived flag
    // For now, we'll just show a toast
    toast.success('Message archived');
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('gov_messages')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
        setIsMessageOpen(false);
      }
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // No SA ID yet
  if (!userSaid) {
    return (
      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InboxIcon className="h-5 w-5 text-primary" />
            Government Services Inbox
          </CardTitle>
          <CardDescription>
            You need to set your South African ID number in your profile to access government messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No SA ID Found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
            To receive official government communications, please update your profile with your
            South African ID number.
          </p>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InboxIcon className="h-5 w-5 text-primary" />
            Government Services Inbox
          </CardTitle>
          <CardDescription>Loading your official communications...</CardDescription>
        </CardHeader>
        <CardContent className="p-8 flex justify-center">
          <div className="flex flex-col items-center">
            <Clock className="h-8 w-8 text-muted-foreground animate-pulse mb-2" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty inbox state
  if (messages.length === 0) {
    return (
      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InboxIcon className="h-5 w-5 text-primary" />
            Government Services Inbox
          </CardTitle>
          <CardDescription>Your official government communications</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Messages</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            There are no official communications for your ID number at this time. 
            Check back later for updates from government departments.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Main inbox with messages
  return (
    <>
      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InboxIcon className="h-5 w-5 text-primary" />
            Government Services Inbox
          </CardTitle>
          <CardDescription>Your official government communications</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" title="Archive">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Mark as important">
              <Flag className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 mb-4 mx-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Mail className="h-4 w-4 sm:mr-1" />
                <span className="hidden xs:inline">All</span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                <span className="hidden xs:inline">Unread</span>
                {unreadCount > 0 && (
                  <Badge className="ml-auto bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="important" className="flex items-center gap-2">
                <span className="hidden xs:inline">Important</span>
                {importantCount > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
                    {importantCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
              <TabsTrigger value="grants">Grants</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: '2%' }}></TableHead>
                    <TableHead style={{ width: '23%' }}>Department</TableHead>
                    <TableHead style={{ width: '45%' }}>Subject</TableHead>
                    <TableHead style={{ width: '15%' }}>Reference</TableHead>
                    <TableHead style={{ width: '15%' }}>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredMessages().map((message) => (
                    <TableRow 
                      key={message.id}
                      className={`cursor-pointer ${message.read ? '' : 'font-medium bg-primary/5'}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <TableCell>
                        {message.important && (
                          <Flag className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{message.sender_department}</div>
                        <div className="text-xs text-muted-foreground">
                          {message.category}
                        </div>
                      </TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>{message.reference_number || '-'}</TableCell>
                      <TableCell>{formatDate(message.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {getFilteredMessages().length === 0 && (
                <div className="flex justify-center p-8 text-muted-foreground">
                  No messages matching your filters
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isMessageOpen} onOpenChange={(open) => {
        setIsMessageOpen(open);
        if (!open) setReplyContent("");
      }}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl">{selectedMessage.subject}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleImportant(selectedMessage.id, selectedMessage.important)}
                    >
                      <Flag className={`h-4 w-4 ${selectedMessage.important ? 'text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => archiveMessage(selectedMessage.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DialogDescription className="mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{selectedMessage.sender_department}</span>
                      {selectedMessage.reference_number && (
                        <span className="ml-2 text-muted-foreground">
                          Ref: {selectedMessage.reference_number}
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {formatDate(selectedMessage.created_at)}
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1 my-4">
                <div className="space-y-4">
                  <div className="text-sm whitespace-pre-wrap">
                    {selectedMessage.content}
                  </div>
                  
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Attachments</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div 
                            key={index}
                            className="flex items-center p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                          >
                            <File className="h-4 w-4 mr-2" />
                            <span className="text-xs">{attachment.name}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <Separator />
              
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Reply className="h-4 w-4 mr-2" />
                  <span className="font-medium">Reply to {selectedMessage.sender_department}</span>
                </div>
                <Textarea
                  placeholder={`Type your reply to ${selectedMessage.sender_department}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <DialogFooter className="mt-4">
                  <Button 
                    type="submit" 
                    onClick={handleSubmitReply} 
                    disabled={!replyContent.trim() || isReplying}
                  >
                    {isReplying ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
