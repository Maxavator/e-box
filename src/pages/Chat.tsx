
import { useChat } from "@/hooks/use-chat";
import { ChatContent } from "@/components/chat/ChatContent";
import { ChatInput } from "@/components/chat/ChatInput";
import { useEffect } from "react";
import { startMessageSimulation } from "@/utils/messageSimulator";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/shared/MainLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Chat sidebar */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="h-full">
          <div className="h-full overflow-auto">
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
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Chat content */}
        <ResizablePanel defaultSize={75} className="h-full">
          <div className="flex flex-col h-full">
            {selectedConversation ? (
              <>
                <div className="bg-muted/20 p-2 border-b flex justify-between items-center">
                  <h2 className="text-sm font-medium">{selectedConversation.name}</h2>
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
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </MainLayout>
  );
}

export default Chat;
