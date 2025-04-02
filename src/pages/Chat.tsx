
import { useChat } from "@/hooks/use-chat";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContent } from "@/components/chat/ChatContent";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Menu, Megaphone } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BroadcastComposer } from "@/components/chat/broadcast/BroadcastComposer";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

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
    isNewConversation,
  } = useChat();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();
  const { userRole } = useUserRole();
  const [showBroadcast, setShowBroadcast] = useState(false);

  // Check if user can send broadcast messages
  const canBroadcast = ['global_admin', 'org_admin', 'comm_moderator'].includes(userRole || '');

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
    } else if (activeTab === "broadcast" && canBroadcast) {
      setSearchParams({ view: "broadcast" });
    } else {
      setSearchParams({});
    }
  }, [selectedConversation, activeTab, calendarView, canBroadcast, setSearchParams]);

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

  // Toggle broadcast view for admins/moderators
  const toggleBroadcast = () => {
    if (!canBroadcast) return;
    
    setShowBroadcast(!showBroadcast);
    if (!showBroadcast) {
      setActiveTab("broadcast");
      navigate("/chat?view=broadcast");
    } else {
      setActiveTab("chats");
      navigate("/chat");
    }
  };

  // Handle sending a message
  const onSendMessage = () => {
    if (selectedConversation && newMessage.trim()) {
      handleSendMessage();
    }
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
                  canBroadcast={canBroadcast}
                  onBroadcastClick={toggleBroadcast}
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
                  {canBroadcast && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleBroadcast}
                      className="ml-auto"
                    >
                      <Megaphone className="h-4 w-4 mr-2" />
                      Broadcast
                    </Button>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  {showBroadcast ? (
                    <div className="p-4">
                      <BroadcastComposer />
                    </div>
                  ) : (
                    <ChatContent
                      conversation={selectedConversation}
                      onEditMessage={handleEditMessage}
                      onDeleteMessage={handleDeleteMessage}
                      onReactToMessage={handleReaction}
                      messages={selectedConversation?.messages || []}
                      isNewConversation={isNewConversation}
                      newMessage={newMessage}
                      onNewMessageChange={setNewMessage}
                      onSendMessage={onSendMessage}
                    />
                  )}
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
                canBroadcast={canBroadcast}
                onBroadcastClick={toggleBroadcast}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="h-full overflow-hidden">
              {showBroadcast ? (
                <div className="p-8 max-w-2xl mx-auto">
                  <BroadcastComposer />
                </div>
              ) : (
                <ChatContent
                  conversation={selectedConversation}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onReactToMessage={handleReaction}
                  messages={selectedConversation?.messages || []}
                  isNewConversation={isNewConversation}
                  newMessage={newMessage}
                  onNewMessageChange={setNewMessage}
                  onSendMessage={onSendMessage}
                />
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}

export default Chat;
