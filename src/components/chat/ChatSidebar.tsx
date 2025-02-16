
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, Inbox, PlusCircle } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/calendar/NewEventDialog";

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
  return (
    <div className="h-full bg-gray-50">
      <div className="p-4">
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
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="h-full p-0">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={onSelectConversation}
          />
        </TabsContent>

        <TabsContent value="calendar" className="h-full">
          <CalendarActions onCalendarActionClick={onCalendarActionClick} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
