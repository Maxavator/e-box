
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Briefcase, LayoutDashboard, FileText, Settings, Clock, Calendar, Users } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { NewMessageDialog } from "./NewMessageDialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const handleFeatureClick = (feature: string) => {
    window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: feature }));
  };

  return (
    <div className="p-4 space-y-2">
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('dashboard')}>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('calendar')}>
        <Calendar className="mr-2 h-4 w-4" />
        My Calendar
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('contacts')}>
        <Users className="mr-2 h-4 w-4" />
        Contacts List
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('documents')}>
        <FileText className="mr-2 h-4 w-4" />
        My Documents
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('leave-manager')}>
        <Clock className="mr-2 h-4 w-4" />
        Leave Manager
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('policies')}>
        <FileText className="mr-2 h-4 w-4" />
        Policies
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('settings')}>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </div>
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
  const [displayName, setDisplayName] = useState<string>("");
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setDisplayName(`${profileData.first_name} ${profileData.last_name}`);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 space-y-4">
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
        {displayName && (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg shadow-sm">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute -right-0.5 -bottom-0.5 ring-2 ring-white" />
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {displayName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="h-[calc(100%-5rem)]">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="chats"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
          >
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Chats</span>
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
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Desk
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="h-full p-0">
          <div className="p-4">
            <NewMessageDialog />
          </div>
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={onSelectConversation}
          />
        </TabsContent>

        <TabsContent value="desk" className="h-full">
          <DeskFeatures />
        </TabsContent>
      </Tabs>
    </div>
  );
}
