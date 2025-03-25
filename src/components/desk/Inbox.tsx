
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Inbox as InboxIcon, Mail, Archive, Star, Trash2, AlertCircle, FileCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for inbox messages
const mockMessages = [
  {
    id: "1",
    sender: "HR Department",
    avatar: null,
    subject: "Your Leave Request Approved",
    preview: "Your leave request for April 12-15 has been approved by management.",
    date: "Today, 10:23 AM",
    read: false,
    category: "important",
    type: "notification"
  },
  {
    id: "2",
    sender: "Finance Team",
    avatar: null,
    subject: "New Payslip Available",
    preview: "Your payslip for March 2024 is now available. Please log in to view and download.",
    date: "Yesterday",
    read: true,
    category: "regular",
    type: "document"
  },
  {
    id: "3",
    sender: "IT Support",
    avatar: null,
    subject: "System Maintenance Notification",
    preview: "There will be scheduled maintenance on April 15th from 8PM to 10PM. Services might be unavailable during this period.",
    date: "Apr 2",
    read: true,
    category: "regular",
    type: "notification"
  }
];

interface MessageItemProps {
  message: typeof mockMessages[0];
  onMessageSelect: (id: string) => void;
}

const MessageItem = ({ message, onMessageSelect }: MessageItemProps) => {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
  
  return (
    <div 
      className={`p-4 border-b last:border-b-0 ${!message.read ? 'bg-primary/5' : ''} hover:bg-muted/50 cursor-pointer transition-colors`}
      onClick={() => onMessageSelect(message.id)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src={message.avatar || ""} alt={message.sender} />
          <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium flex items-center gap-2">
              {message.sender}
              {message.category === 'important' && (
                <Badge variant="destructive" className="text-[10px] h-5">Important</Badge>
              )}
              {!message.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{message.date}</div>
          </div>
          
          <div className="font-medium text-sm mb-1">{message.subject}</div>
          <div className="text-sm text-muted-foreground truncate">{message.preview}</div>
          
          <div className="flex items-center mt-2 gap-2">
            {message.type === 'document' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <FileCheck className="h-3 w-3" />
                <span>Document</span>
              </Badge>
            )}
            {message.type === 'notification' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Notification</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Inbox = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleMessageSelect = (id: string) => {
    setSelectedMessage(id);
    // Mark as read in a real app
  };
  
  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'unread':
        return mockMessages.filter(m => !m.read);
      case 'important':
        return mockMessages.filter(m => m.category === 'important');
      case 'documents':
        return mockMessages.filter(m => m.type === 'document');
      default:
        return mockMessages;
    }
  };
  
  const unreadCount = mockMessages.filter(m => !m.read).length;
  const importantCount = mockMessages.filter(m => m.category === 'important').length;
  const documentsCount = mockMessages.filter(m => m.type === 'document').length;
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <InboxIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Inbox</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Star className="h-4 w-4 mr-2" />
            Important
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4 mx-4 mt-2">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                <span>Unread</span>
                {unreadCount > 0 && (
                  <Badge className="ml-auto bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="important" className="flex items-center gap-2">
                <span>Important</span>
                {importantCount > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
                    {importantCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <span>Documents</span>
                {documentsCount > 0 && (
                  <Badge className="ml-auto bg-green-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
                    {documentsCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="divide-y">
                {getFilteredMessages().map(message => (
                  <MessageItem 
                    key={message.id}
                    message={message}
                    onMessageSelect={handleMessageSelect}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              <div className="divide-y">
                {getFilteredMessages().map(message => (
                  <MessageItem 
                    key={message.id}
                    message={message}
                    onMessageSelect={handleMessageSelect}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="important" className="m-0">
              <div className="divide-y">
                {getFilteredMessages().map(message => (
                  <MessageItem 
                    key={message.id}
                    message={message}
                    onMessageSelect={handleMessageSelect}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="m-0">
              <div className="divide-y">
                {getFilteredMessages().map(message => (
                  <MessageItem 
                    key={message.id}
                    message={message}
                    onMessageSelect={handleMessageSelect}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
