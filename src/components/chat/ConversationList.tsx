
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import type { Conversation } from "@/types/chat";
import { getUserById } from "@/data/chat";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}: ConversationListProps) {
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="flex flex-col h-full">
      {totalUnreadCount > 0 && (
        <div className="px-4 py-2 bg-primary/5 border-b">
          <div className="flex items-center gap-2 text-sm text-primary">
            <MessageSquare className="h-4 w-4" />
            <span>{totalUnreadCount} unread message{totalUnreadCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
      <ScrollArea className="flex-1">
        {conversations.map((conversation) => {
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          const user = getUserById(conversation.userId);
          
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedConversation?.id === conversation.id ? "bg-gray-100" : ""
              } relative`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 text-xs font-medium text-white bg-primary rounded-full px-1.5">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {user?.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {lastMessage.timestamp}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-500"
                  }`}>
                    {lastMessage.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
