
import { useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/use-chat";
import { ChatLayout } from "@/components/chat/ChatLayout";

const Chat = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    calendarView,
    setCalendarView,
    selectedConversation,
    newMessage,
    setNewMessage,
    filteredConversations,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
  } = useChat();

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setCalendarView(view);
    setActiveTab('calendar');
  };

  return (
    <ChatLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      conversations={filteredConversations}
      selectedConversation={selectedConversation}
      onSelectConversation={handleSelectConversation}
      onCalendarActionClick={handleCalendarActionClick}
      newMessage={newMessage}
      onNewMessageChange={setNewMessage}
      onSendMessage={handleSendMessage}
      onEditMessage={handleEditMessage}
      onDeleteMessage={handleDeleteMessage}
      onReactToMessage={handleReaction}
      calendarView={calendarView}
      onLogout={handleLogout}
      onLogoClick={handleLogoClick}
    />
  );
};

export default Chat;
