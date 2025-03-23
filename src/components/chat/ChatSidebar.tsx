
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/chat";
import { NewMessageDialog } from "./NewMessageDialog";
import { Badge } from "@/components/ui/badge";
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

export function ChatSidebar({
  searchQuery,
  onSearchChange,
  conversations,
  selectedConversation,
  onSelectConversation,
}: ChatSidebarProps) {
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            <h2 className="font-medium">Chats</h2>
            {totalUnreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-2 px-1.5 py-0.5 h-5"
              >
                {totalUnreadCount}
              </Badge>
            )}
          </div>
        </div>
        <Input
          type="search"
          placeholder="Search messages and contacts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border-input focus-visible:ring-1"
        />
      </div>
      
      <div className="px-4 mt-4 mb-4">
        <NewMessageDialog />
      </div>
      
      <ScrollArea className="flex-1">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      </ScrollArea>
    </div>
  );
}
