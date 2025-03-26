
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Conversation, Message } from "@/types/chat";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return conversations.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full pb-10">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground">
          Start a new conversation using the button above
        </p>
      </div>
    </div>
  ) : (
    <ScrollArea className="flex-1">
      <div className="space-y-1 px-1">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            className={cn(
              "w-full flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left",
              selectedConversation?.id === conversation.id &&
                "bg-accent/50 hover:bg-accent"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <Avatar className="h-9 w-9 mt-1">
              <AvatarImage
                src={conversation.avatar}
                alt={conversation.name}
              />
              <AvatarFallback>
                {conversation.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none truncate">
                  {conversation.name}
                </p>
                {conversation.lastMessage && typeof conversation.lastMessage !== 'string' && (
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(conversation.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              {conversation.lastMessage && typeof conversation.lastMessage !== 'string' && (
                <p className="text-xs text-muted-foreground truncate">
                  {conversation.lastMessage.sender === "me" && "You: "}
                  {conversation.lastMessage.text}
                </p>
              )}
              <div className="flex items-center gap-1.5">
                {conversation.draft && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 hover:bg-primary/30 text-xs font-normal"
                  >
                    Draft
                  </Badge>
                )}
                {conversation.unread && (
                  <Badge variant="default" className="text-xs font-normal">
                    New
                  </Badge>
                )}
                {conversation.labels &&
                  conversation.labels.map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="border-primary/50 text-xs font-normal"
                    >
                      {label}
                    </Badge>
                  ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
}
