
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, Inbox, Briefcase, LayoutDashboard, FileText, Settings, Clock } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/calendar/NewEventDialog";
import { NewMessageDialog } from "./NewMessageDialog";
import { useState } from "react";

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

const CalendarActions = ({ onCalendarActionClick }: { onCalendarActionClick: (view: 'calendar' | 'inbox') => void }) => {
  return (
    <div className="p-4 space-y-2">
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={() => onCalendarActionClick('inbox')}
      >
        <Inbox className="mr-2 h-4 w-4" />
        Calendar Inbox
      </Button>
      <NewEventDialog />
    </div>
  );
};

const DeskFeatures = ({ onTabChange, onCalendarActionClick }: { 
  onTabChange: (value: string) => void;
  onCalendarActionClick: (view: 'calendar' | 'inbox') => void;
}) => {
  const [activeDeskTab, setActiveDeskTab] = useState("dashboard");

  return (
    <div className="h-full">
      <Tabs value={activeDeskTab} onValueChange={setActiveDeskTab} className="h-full">
        <TabsList className="w-full justify-start px-4 pt-4">
          <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
          <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'dashboard' }))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onCalendarActionClick('calendar')}>
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'documents' }))}>
            <FileText className="mr-2 h-4 w-4" />
            My Documents
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'leave-manager' }))}>
            <Clock className="mr-2 h-4 w-4" />
            Leave Manager
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'policies' }))}>
            <FileText className="mr-2 h-4 w-4" />
            Policies
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'settings' }))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </TabsContent>

        <TabsContent value="calendar" className="h-full">
          <CalendarActions onCalendarActionClick={onCalendarActionClick} />
        </TabsContent>
      </Tabs>
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
  onCalendarActionClick,
}: ChatSidebarProps) {
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

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
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="h-[calc(100%-5rem)]">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="chats"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chats
            {totalUnreadCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {totalUnreadCount}
              </span>
            )}
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
          <DeskFeatures onTabChange={onTabChange} onCalendarActionClick={onCalendarActionClick} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
