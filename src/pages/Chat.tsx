
import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContent } from "@/components/chat/ChatContent";
import { useConversations } from "@/hooks/useConversations";
import { Conversation } from "@/types/chat";
import { Dashboard } from "@/components/desk/Dashboard";
import { Documents } from "@/components/desk/Documents";
import { Helpdesk } from "@/components/desk/Helpdesk";
import { Settings } from "@/components/desk/Settings";
import { CalendarDashboard } from "@/components/calendar/CalendarDashboard";
import { CalendarInbox } from "@/components/calendar/CalendarInbox";

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [deskFeature, setDeskFeature] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'calendar' | 'inbox' | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { conversations } = useConversations();

  useEffect(() => {
    const handleDeskFeatureSelected = (event: CustomEvent<string>) => {
      setDeskFeature(event.detail);
      setCalendarView(null);
    };

    window.addEventListener('desk-feature-selected', handleDeskFeatureSelected as EventListener);

    return () => {
      window.removeEventListener('desk-feature-selected', handleDeskFeatureSelected as EventListener);
    };
  }, []);

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setCalendarView(view);
    setDeskFeature(null);
  };

  const handleSendMessage = () => {
    // Implement message sending logic
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    // Implement message editing logic
    console.log("Editing message:", messageId, newText);
  };

  const handleDeleteMessage = (messageId: string) => {
    // Implement message deletion logic
    console.log("Deleting message:", messageId);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    // Implement message reaction logic
    console.log("Reacting to message:", messageId, emoji);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out");
  };

  const handleLogoClick = () => {
    // Implement logo click logic
    console.log("Logo clicked");
  };

  const renderMainContent = () => {
    if (calendarView === 'calendar') {
      return <CalendarDashboard />;
    }
    if (calendarView === 'inbox') {
      return <CalendarInbox />;
    }
    if (activeTab === 'desk') {
      switch (deskFeature) {
        case 'dashboard':
          return <Dashboard />;
        case 'documents':
          return <Documents />;
        case 'helpdesk':
          return <Helpdesk />;
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    }
    return (
      <ChatContent
        activeTab={activeTab}
        selectedConversation={selectedConversation}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onReactToMessage={handleReactToMessage}
        calendarView={calendarView as 'calendar' | 'inbox'}
      />
    );
  };

  return (
    <ChatLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      conversations={conversations}
      selectedConversation={selectedConversation}
      onSelectConversation={setSelectedConversation}
      onCalendarActionClick={handleCalendarActionClick}
      newMessage={newMessage}
      onNewMessageChange={setNewMessage}
      onSendMessage={handleSendMessage}
      onEditMessage={handleEditMessage}
      onDeleteMessage={handleDeleteMessage}
      onReactToMessage={handleReactToMessage}
      calendarView={calendarView as 'calendar' | 'inbox'}
      onLogout={handleLogout}
      onLogoClick={handleLogoClick}
    >
      <ChatSidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        onCalendarActionClick={handleCalendarActionClick}
      />
      {renderMainContent()}
    </ChatLayout>
  );
};

export default Chat;
