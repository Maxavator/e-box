
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { CalendarView } from "@/components/calendar/CalendarView";
import type { Conversation, Message } from "@/types/chat";
import { getUserById } from "@/data/chat";

interface ChatContentProps {
  activeTab: string;
  selectedConversation: Conversation | null;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function ChatContent({
  activeTab,
  selectedConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
}: ChatContentProps) {
  if (activeTab !== "chats") {
    return <CalendarView />;
  }

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">
              {getUserById(selectedConversation.userId)?.name}
            </p>
            <p className="text-sm text-gray-500">
              {getUserById(selectedConversation.userId)?.status}
            </p>
          </div>
        </div>
      </div>

      <MessageList
        messages={selectedConversation.messages}
        onEditMessage={onEditMessage}
        onDeleteMessage={onDeleteMessage}
        onReactToMessage={onReactToMessage}
      />

      <ChatInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSend={onSendMessage}
      />
    </div>
  );
}
