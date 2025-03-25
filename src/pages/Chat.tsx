
import { useChat } from "@/hooks/use-chat";
import { ChatContent } from "@/components/chat/ChatContent";
import { ChatInput } from "@/components/chat/ChatInput";
import { useEffect } from "react";
import { startMessageSimulation } from "@/utils/messageSimulator";
import { useToast } from "@/hooks/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    attachments,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
    handleAttachFiles,
    handleRemoveAttachment,
    isNewConversation,
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

  const handleSendWithAttachments = () => {
    handleSendMessage(attachments);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Chat sidebar */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="h-full">
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
                isNewConversation={isNewConversation}
              />
              
              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="bg-background p-2 border-t flex flex-wrap gap-2">
                  {attachments.map(attachment => (
                    <div 
                      key={attachment.id}
                      className="flex items-center bg-muted p-2 rounded-md"
                    >
                      <File className="h-4 w-4 mr-2" />
                      <span className="text-xs max-w-32 truncate">{attachment.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <ChatInput
                value={newMessage}
                onChange={setNewMessage}
                onSendMessage={handleSendWithAttachments}
                onAttach={handleAttachFiles}
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
  );
}

export default Chat;
