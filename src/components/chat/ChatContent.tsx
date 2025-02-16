
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarInbox } from "@/components/calendar/CalendarInbox";
import { CalendarDashboard } from "@/components/calendar/CalendarDashboard";
import type { Conversation } from "@/types/chat";
import { getUserById } from "@/data/chat";
import OrganizationDashboard from "@/pages/OrganizationDashboard";

interface ChatContentProps {
  activeTab: string;
  selectedConversation: Conversation | null;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  calendarView?: 'calendar' | 'inbox';
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
  calendarView = 'calendar',
}: ChatContentProps) {
  if (activeTab === "calendar") {
    if (calendarView === 'inbox') return <CalendarInbox />;
    if (calendarView === 'calendar') return <CalendarView />;
    return <CalendarDashboard />;
  }

  if (!selectedConversation) {
    return <OrganizationDashboard />;
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
