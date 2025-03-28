
import { useChat } from "@/hooks/use-chat";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContent } from "@/components/chat/ChatContent";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export function Chat() {
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
    colleagues,
    golderColleagues,
    isLoadingColleagues,
    isLoadingGolderColleagues,
    showSidebar,
    setShowSidebar,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
    handleStartConversationWithColleague,
  } = useChat();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();

  // Handle conversation selection from URL
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId) {
      handleSelectConversation(conversationId);
      setActiveTab("chats");
    }
  }, [searchParams, handleSelectConversation, setActiveTab]);

  // Handle calendar view selection from URL
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "calendar" || view === "inbox" || view === "proposed") {
      setCalendarView(view);
      setActiveTab("calendar");
    }
  }, [searchParams, setCalendarView, setActiveTab]);

  // Update URL when conversation is selected
  useEffect(() => {
    if (selectedConversation && activeTab === "chats") {
      setSearchParams({ conversation: selectedConversation.id });
    } else if (activeTab === "calendar") {
      setSearchParams({ view: calendarView });
    } else {
      setSearchParams({});
    }
  }, [selectedConversation, activeTab, calendarView, setSearchParams]);

  // Auto-hide sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile, setShowSidebar]);

  // Handle calendar action selection
  const handleCalendarAction = (view: "calendar" | "inbox" | "proposed") => {
    setCalendarView(view);
    navigate(`/chat?view=${view}`);
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          
          <div className="h-full flex flex-col">
            {showSidebar ? (
              <div className="h-full">
                <ChatSidebar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  conversations={filteredConversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                  onCalendarActionClick={handleCalendarAction}
                  colleagues={colleagues}
                  golderColleagues={golderColleagues}
                  isLoadingColleagues={isLoadingColleagues}
                  isLoadingGolderColleagues={isLoadingGolderColleagues}
                  onStartConversation={handleStartConversationWithColleague}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center p-2 border-b">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatContent
                    conversation={selectedConversation}
                    onEditMessage={handleEditMessage}
                    onDeleteMessage={handleDeleteMessage}
                    onReactToMessage={handleReaction}
                    messages={selectedConversation?.messages || []}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
          >
            <ResizablePanel
              defaultSize={25}
              minSize={20}
              maxSize={40}
              className="h-full border-r"
            >
              <ChatSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                conversations={filteredConversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
                onCalendarActionClick={handleCalendarAction}
                colleagues={colleagues}
                golderColleagues={golderColleagues}
                isLoadingColleagues={isLoadingColleagues}
                isLoadingGolderColleagues={isLoadingGolderColleagues}
                onStartConversation={handleStartConversationWithColleague}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="h-full overflow-hidden">
              <ChatContent
                conversation={selectedConversation}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onReactToMessage={handleReaction}
                messages={selectedConversation?.messages || []}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}

export default Chat;
