
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Briefcase } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { DeskFeatures } from "./DeskFeatures";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";

interface ChatSidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCalendarActionClick: (view: 'calendar' | 'inbox') => void;
  calendarView: string;
  isMobile: boolean;
}

export function ChatSidebar({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  conversations,
  selectedConversation,
  onSelectConversation,
  calendarView,
}: ChatSidebarProps) {
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r">
        <SidebarContent>
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
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

