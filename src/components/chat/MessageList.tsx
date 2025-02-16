
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./MessageItem";
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
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isMine={message.senderId === 'me'}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
            onReaction={onReactToMessage}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
