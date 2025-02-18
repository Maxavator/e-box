
import { useState } from "react";
import { MessageSquare, Calendar, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Conversation } from "@/types/chat";

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

export const ChatSidebar = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  conversations,
  selectedConversation,
  onSelectConversation,
  onCalendarActionClick,
}: ChatSidebarProps) => {
  return (
    <div className="w-full h-full flex flex-col border-r">
      <div className="p-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start px-4 h-12">
          <TabsTrigger value="chats" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="helpdesk" className="gap-2">
            <Ticket className="h-4 w-4" />
            Helpdesk
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "chats" && (
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      )}

      {activeTab === "calendar" && (
        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onCalendarActionClick('calendar')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onCalendarActionClick('inbox')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Calendar Inbox
          </Button>
        </div>
      )}
    </div>
  );
};
