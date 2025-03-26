
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MessageSquare, Users } from "lucide-react";
import { type Conversation } from "@/types/chat";
import { SearchInput } from "./sidebar/SearchInput";
import { ChatsTabContent } from "./sidebar/ChatsTabContent";
import { CalendarTabContent } from "./sidebar/CalendarTabContent";
import { ColleaguesTabContent } from "./sidebar/ColleaguesTabContent";

interface ChatSidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (id: string) => void;
  onCalendarActionClick: (view: "calendar" | "inbox") => void;
  colleagues?: Array<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url?: string;
    job_title?: string;
  }>;
  golderColleagues?: Array<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url?: string;
    job_title?: string;
  }>;
  isLoadingColleagues?: boolean;
  isLoadingGolderColleagues?: boolean;
  onStartConversation?: (colleagueId: string) => void;
}

export function ChatSidebar({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  conversations,
  selectedConversation,
  onSelectConversation,
  onCalendarActionClick,
  colleagues = [],
  golderColleagues = [],
  isLoadingColleagues = false,
  isLoadingGolderColleagues = false,
  onStartConversation,
}: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b">
        <SearchInput 
          value={searchQuery} 
          onChange={onSearchChange} 
        />
      </div>
      <Tabs
        defaultValue="chats"
        value={activeTab}
        onValueChange={onTabChange}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="grid grid-cols-3 px-4 py-2">
          <TabsTrigger value="chats">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Chats</span>
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="colleagues">
            <Users className="h-4 w-4 mr-2" />
            <span>Colleagues</span>
          </TabsTrigger>
        </TabsList>
        <div className="p-4 flex-1 overflow-hidden">
          <TabsContent value="chats" className="h-full flex flex-col">
            <ChatsTabContent
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={onSelectConversation}
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4 pt-2">
            <CalendarTabContent onCalendarActionClick={onCalendarActionClick} />
          </TabsContent>
          
          <TabsContent value="colleagues" className="h-full">
            <ColleaguesTabContent
              searchQuery={searchQuery}
              colleagues={colleagues}
              golderColleagues={golderColleagues}
              isLoadingColleagues={isLoadingColleagues}
              isLoadingGolderColleagues={isLoadingGolderColleagues}
              onStartConversation={onStartConversation || (() => {})}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
