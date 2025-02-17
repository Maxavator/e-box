
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, Inbox, Briefcase, Mail, FileText } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/calendar/NewEventDialog";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { PostBox } from "@/components/desk/PostBox";
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

const DeskFeatures = ({ activeFeature, onFeatureSelect }: { 
  activeFeature: string, 
  onFeatureSelect: (feature: string) => void 
}) => {
  const features = [
    { id: 'policies', label: 'Policies', icon: FileText },
  ];

  return (
    <div className="p-4 space-y-2">
      {features.map((feature) => (
        <Button
          key={feature.id}
          variant={activeFeature === feature.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onFeatureSelect(feature.id)}
        >
          <feature.icon className="mr-2 h-4 w-4" />
          {feature.label}
        </Button>
      ))}
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
  const [activeDeskFeature, setActiveDeskFeature] = useState('policies');

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
          <TabsTrigger
            value="desk"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Desk
          </TabsTrigger>
          <TabsTrigger
            value="postbox"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Post Box
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

        <TabsContent value="desk" className="h-full">
          <DeskFeatures 
            activeFeature={activeDeskFeature} 
            onFeatureSelect={setActiveDeskFeature} 
          />
          <div className="border-t">
            <LeaveManager defaultTab={activeDeskFeature} />
          </div>
        </TabsContent>

        <TabsContent value="postbox" className="h-full">
          <PostBox />
        </TabsContent>
      </Tabs>
    </div>
  );
}
