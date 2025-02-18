
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, Inbox, Briefcase, LayoutDashboard, Car, FileText, Headset, Settings } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/calendar/NewEventDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

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

const DeskFeatures = () => {
  return (
    <div className="p-4 space-y-2">
      <Button variant="ghost" className="w-full justify-start">
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <Car className="mr-2 h-4 w-4" />
        Fleet Manager
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <FileText className="mr-2 h-4 w-4" />
        My Documents
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <FileText className="mr-2 h-4 w-4" />
        Policies
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <Headset className="mr-2 h-4 w-4" />
        Helpdesk
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
  onCalendarActionClick,
}: ChatSidebarProps) {
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" alt="Afrovation" />
            <AvatarFallback>AF</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2">
              <span className="animate-pulse h-2 w-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Profile Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
          <DeskFeatures />
        </TabsContent>
      </Tabs>
    </div>
  );
}
