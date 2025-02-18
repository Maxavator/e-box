
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "@/components/chat/MessageItem";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function MessageList({ 
  messages,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage
}: MessageListProps) {
  if (!messages || messages.length === 0) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4 text-center text-muted-foreground">
          No messages yet
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
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
