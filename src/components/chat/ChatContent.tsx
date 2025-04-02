
import { useRef, useEffect } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { Conversation, Message, Attachment } from "@/types/chat";

interface ChatContentProps {
  conversation: Conversation | null;
  messages: Message[];
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  isNewConversation?: boolean;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  attachments?: Attachment[];
  onAttachFiles?: () => void;
  onRemoveAttachment?: (id: string) => void;
}

export function ChatContent({
  conversation,
  messages,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  isNewConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  attachments = [],
  onAttachFiles,
  onRemoveAttachment
}: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {conversation ? (
        <>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">{conversation.name}</h2>
            {conversation.isGroup && (
              <p className="text-sm text-muted-foreground">
                {conversation.participantIds.length} participants
              </p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList
              messages={messages}
              onEditMessage={onEditMessage}
              onDeleteMessage={onDeleteMessage}
              onReactToMessage={onReactToMessage}
            />
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            value={newMessage}
            onChange={onNewMessageChange}
            onSendMessage={onSendMessage}
            onAttach={onAttachFiles}
            attachments={attachments}
            onRemoveAttachment={onRemoveAttachment}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
          <p className="text-muted-foreground mb-6">
            Select a conversation or start a new one
          </p>
        </div>
      )}
    </div>
  );
}
