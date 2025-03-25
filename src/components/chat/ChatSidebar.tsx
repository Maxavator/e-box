
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Inbox, MessageSquare, Search, Users } from "lucide-react";
import { ConversationList } from "./ConversationList";
import { NewMessageDialog } from "./NewMessageDialog";
import { type Conversation } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  isLoadingColleagues?: boolean;
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
  isLoadingColleagues = false,
  onStartConversation,
}: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages…"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
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
            <div className="mb-4">
              <NewMessageDialog />
            </div>
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={onSelectConversation}
            />
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onCalendarActionClick("calendar")}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>Calendar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onCalendarActionClick("inbox")}
              >
                <Inbox className="h-4 w-4 mr-2" />
                <span>Invites</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="colleagues" className="h-full">
            <ScrollArea className="h-full">
              {isLoadingColleagues ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading colleagues...
                </div>
              ) : colleagues.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No colleagues found in your organization
                </div>
              ) : (
                <div className="space-y-2">
                  {colleagues
                    .filter(colleague => {
                      if (!searchQuery) return true;
                      const name = `${colleague.first_name || ''} ${colleague.last_name || ''}`.toLowerCase();
                      return name.includes(searchQuery.toLowerCase());
                    })
                    .map((colleague) => (
                      <Button
                        key={colleague.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => onStartConversation?.(colleague.id)}
                      >
                        <div className="flex items-center w-full">
                          <Avatar className="h-9 w-9 mr-2">
                            <AvatarImage src={colleague.avatar_url || ''} />
                            <AvatarFallback>
                              {colleague.first_name?.[0]}{colleague.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {colleague.first_name} {colleague.last_name}
                            </span>
                            {colleague.job_title && (
                              <span className="text-xs text-muted-foreground">
                                {colleague.job_title}
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
