
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/data/chat";
import type { Conversation } from "@/types/chat";
import { Check, MoreVertical, Pen, Shield, Trash2, X } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isAdminChat?: boolean;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  isAdminChat = false,
}: ConversationListProps) {
  return (
    <div className="space-y-1 p-2">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          {isAdminChat ? "No admin messages yet" : "No conversations yet"}
        </div>
      ) : (
        conversations.map((conversation) => {
          // For admin group chat, use special rendering
          if (isAdminChat || conversation.isGroup || conversation.isAdminGroup) {
            return (
              <button
                key={conversation.id}
                className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-muted'
                    : 'hover:bg-muted/60'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {conversation.groupName || "e-Box Admin Group"}
                    </span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage || "No messages yet"}
                  </div>
                </div>
              </button>
            );
          }

          // Regular conversation rendering
          const user = getUserById(conversation.userId);
          if (!user) return null;

          return (
            <button
              key={conversation.id}
              className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                selectedConversation?.id === conversation.id
                  ? 'bg-muted'
                  : 'hover:bg-muted/60'
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{user.name}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {conversation.lastMessage}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
