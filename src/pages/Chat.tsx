
import { useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/use-chat";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useEffect } from "react";
import { startMessageSimulation } from "@/utils/messageSimulator";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const startSimulation = async () => {
      toast({
        title: "Message Simulation Started",
        description: "Messages will be simulated for the next 60 seconds",
      });

      cleanup = await startMessageSimulation(60000);
    };

    startSimulation();

    return () => {
      if (cleanup) {
        cleanup();
        toast({
          title: "Message Simulation Ended",
          description: "Message simulation has been stopped",
        });
      }
    };
  }, [toast]);

  const handleLogout = () => {
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
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
      isMobile={isMobile}
    />
  );
};

export default Chat;
