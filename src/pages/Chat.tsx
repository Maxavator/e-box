
import { useChat } from "@/hooks/use-chat";
import { ChatContent } from "@/components/chat/ChatContent";
import { ChatInput } from "@/components/chat/ChatInput";
import { useEffect } from "react";
import { startMessageSimulation } from "@/utils/messageSimulator";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/shared/MainLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { AdminStatusIndicator } from "@/components/user/AdminStatusIndicator";

const Chat = () => {
  const { toast } = useToast();
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

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setCalendarView(view);
    setActiveTab('calendar');
  };

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden">
        {/* Chat sidebar */}
        <div className="w-full sm:w-80 border-r h-full overflow-auto">
          <ChatSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onCalendarActionClick={handleCalendarActionClick}
          />
        </div>
        
        {/* Chat content */}
        <div className="flex-1 flex flex-col h-full">
          {selectedConversation ? (
            <>
              <div className="bg-muted/20 p-2 border-b flex justify-between items-center">
                <h2 className="text-sm font-medium">{selectedConversation.name}</h2>
                <AdminStatusIndicator />
              </div>
              <ChatContent
                conversation={selectedConversation}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onReactToMessage={handleReaction}
              />
              <ChatInput
                value={newMessage}
                onChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                <p>Choose a conversation from the sidebar or start a new one</p>
                <div className="mt-4 flex justify-center">
                  <AdminStatusIndicator />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Chat;
