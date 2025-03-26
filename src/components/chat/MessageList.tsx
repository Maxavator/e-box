
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "@/components/chat/MessageItem";
import type { Message } from "@/types/chat";
import { MessageSquare, Shield } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  isAdminChat?: boolean;
  isNewConversation?: boolean;
}

export function MessageList({
  messages,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  isAdminChat = false,
  isNewConversation = false,
}: MessageListProps) {
  // Create welcome message
  const welcomeMessage: Message = {
    id: "welcome-message",
    conversationId: messages[0]?.conversationId || "system",
    senderId: "system",
    senderName: "e-Box by Afrovation",
    content: "Welcome to e-Box! This is your secure communication channel. You can send messages, share files, and collaborate with your team members.",
    text: "Welcome to e-Box! This is your secure communication channel. You can send messages, share files, and collaborate with your team members.",
    timestamp: new Date().toISOString(),
    status: "sent",
    reactions: {},
    sender: "system",
  };

  const allMessages = isNewConversation || messages.length === 0
    ? [welcomeMessage, ...messages]
    : messages;

  if (allMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            {isAdminChat ? (
              <Shield className="h-12 w-12 text-muted-foreground" />
            ) : (
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-medium">
            {isAdminChat ? "No Admin Messages Yet" : "No Messages Yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {isAdminChat 
              ? "This is the beginning of the e-Box Admin group chat. Start the conversation!" 
              : "This is the beginning of your conversation. Send a message to get started!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {allMessages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onReactToMessage={onReactToMessage}
            isAdminChat={isAdminChat}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
