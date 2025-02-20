
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Briefcase, LayoutDashboard, FileText, Settings, Clock, Calendar, Users } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { NewMessageDialog } from "./NewMessageDialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCalendarActionClick: (view: 'calendar' | 'inbox') => void;
}

const DeskFeatures = () => {
  const navigate = useNavigate();
  const updatesCount = 3;

  const handleFeatureClick = (route: string) => {
    navigate(route);
  };

  return (
    <ScrollArea className="h-[calc(100vh-14rem)]">
      <div className="space-y-1 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/dashboard')}
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
          {updatesCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {updatesCount} new
            </Badge>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/calendar')}
        >
          <Calendar className="mr-3 h-5 w-5" />
          My Calendar
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/contacts')}
        >
          <Users className="mr-3 h-5 w-5" />
          Contacts List
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/documents')}
        >
          <FileText className="mr-3 h-5 w-5" />
          My Documents
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/leave')}
        >
          <Clock className="mr-3 h-5 w-5" />
          Leave Manager
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/policies')}
        >
          <FileText className="mr-3 h-5 w-5" />
          Policies
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12"
          onClick={() => handleFeatureClick('/settings')}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </div>
    </ScrollArea>
  );
};

export function ChatSidebar({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  conversations,
  selectedConversation,
  onSelectConversation,
}: ChatSidebarProps) {
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b">
        <Input
          type="search"
          placeholder="Search messages and contacts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-secondary"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 p-0">
          <TabsTrigger
            value="chats"
            className="flex-1 relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white h-full"
          >
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              <span className="font-medium">Chats</span>
              {totalUnreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="ml-2 px-1.5 py-0.5 h-5"
                >
                  {totalUnreadCount}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="desk"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white h-full"
          >
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              <span className="font-medium">Desk</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="flex-1 pt-4">
          <div className="px-4 mb-4">
            <NewMessageDialog />
          </div>
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={onSelectConversation}
          />
        </TabsContent>

        <TabsContent value="desk" className="flex-1 p-0">
          <DeskFeatures />
        </TabsContent>
      </Tabs>
    </div>
  );
}
