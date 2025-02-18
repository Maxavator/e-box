
import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { Documents } from "@/components/desk/Documents";
import { Dashboard } from "@/components/desk/Dashboard";
import { Policies } from "@/components/desk/Policies";
import { CalendarDashboard } from "@/components/calendar/CalendarDashboard";
import { CalendarInbox } from "@/components/calendar/CalendarInbox";
import { TicketList } from "@/components/helpdesk/TicketList";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedDeskFeature, setSelectedDeskFeature] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  useEffect(() => {
    const handleDeskFeatureSelected = (event: CustomEvent<string>) => {
      setSelectedDeskFeature(event.detail);
    };

    window.addEventListener('desk-feature-selected', handleDeskFeatureSelected as EventListener);

    return () => {
      window.removeEventListener('desk-feature-selected', handleDeskFeatureSelected as EventListener);
    };
  }, []);

  if (activeTab === "helpdesk") {
    return <TicketList />;
  }

  if (activeTab === 'desk') {
    switch (selectedDeskFeature) {
      case 'documents':
        return <Documents />;
      case 'dashboard':
        return <Dashboard />;
      case 'policies':
        return <Policies />;
      case 'helpdesk':
        return <TicketList />;
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-semibold">Settings</h2></div>;
      default:
        return <Dashboard />;
    }
  }

  if (activeTab === 'calendar') {
    return calendarView === 'calendar' ? (
      <CalendarDashboard />
    ) : (
      <CalendarInbox />
    );
  }

  if (!selectedConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">No conversation selected</h3>
          <p className="text-sm text-gray-500">Choose a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {selectedConversation.messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onEdit={(newText) => onEditMessage(message.id, newText)}
            onDelete={() => onDeleteMessage(message.id)}
            onReact={(emoji) => onReactToMessage(message.id, emoji)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSend={onSendMessage}
      />
    </div>
  );
};
