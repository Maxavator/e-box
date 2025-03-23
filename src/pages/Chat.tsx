
import { useChat } from "@/hooks/use-chat";
import { ChatContent } from "@/components/chat/ChatContent";
import { ChatInput } from "@/components/chat/ChatInput";
import { useEffect } from "react";
import { startMessageSimulation } from "@/utils/messageSimulator";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/shared/MainLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

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
      <div className="flex flex-col h-full">
        {/* Logo at the top */}
        <div className="flex justify-center p-4 border-b">
          <img 
            src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
            alt="e-Box by Afrovation" 
            className="h-12" 
          />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Chat;
