
import { TicketList } from "@/components/helpdesk/TicketList";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarInbox } from "@/components/calendar/CalendarInbox";
import type { Conversation } from "@/types/chat";

interface ChatContentProps {
  activeTab: string;
  selectedConversation: Conversation | null;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  calendarView: 'calendar' | 'inbox';
}

export const ChatContent = ({
  activeTab,
  selectedConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  calendarView,
}: ChatContentProps) => {
  if (activeTab === "helpdesk") {
    return <TicketList />;
  }

  if (activeTab === "calendar") {
    return calendarView === "calendar" ? (
      <CalendarView />
    ) : (
      <CalendarInbox />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <MessageList
        messages={selectedConversation?.messages || []}
        onEditMessage={onEditMessage}
        onDeleteMessage={onDeleteMessage}
        onReactToMessage={onReactToMessage}
      />
      <ChatInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};
