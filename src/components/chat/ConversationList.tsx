
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Conversation } from "@/types/chat";

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
  return (
    <ScrollArea className="h-[calc(100vh-8.5rem)]">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedConversation?.id === conversation.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {getUserById(conversation.userId)?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {getUserById(conversation.userId)?.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {lastMessage.text}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
}
