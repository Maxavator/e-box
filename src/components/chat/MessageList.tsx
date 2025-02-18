
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "@/components/chat/MessageItem";
import type { Conversation } from "@/types/chat";

interface MessageListProps {
  conversation: Conversation | null;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function MessageList({ 
  conversation,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage
}: MessageListProps) {
  if (!conversation) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4 text-center text-muted-foreground">
          Select a conversation to start chatting
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {conversation.messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
            onReact={onReactToMessage}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
