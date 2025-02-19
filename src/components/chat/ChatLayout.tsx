
import { AppHeader } from "@/components/shared/AppHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ChatContent } from "./ChatContent";
import { useEffect, useState } from "react";
import { NewMessageDialog } from "./NewMessageDialog";
import { Button } from "@/components/ui/button";

interface ChatLayoutProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  conversations: any[];
  selectedConversation: any;
  onSelectConversation: (conversation: any) => void;
  onCalendarActionClick: (view: 'calendar' | 'inbox') => void;
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: (message: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, reaction: string) => void;
  calendarView: string;
  onLogout: () => void;
  onLogoClick: () => void;
  isMobile: boolean;
}

export function ChatLayout({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  conversations,
  selectedConversation,
  onSelectConversation,
  onCalendarActionClick,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  calendarView,
  onLogout,
  onLogoClick,
  isMobile,
}: ChatLayoutProps) {
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'n' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setShowNewMessageDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <AppHeader onLogout={onLogout} onLogoClick={onLogoClick} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          activeTab={activeTab}
          onTabChange={onTabChange}
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
          onCalendarActionClick={onCalendarActionClick}
          calendarView={calendarView}
          isMobile={isMobile}
        />
        <ChatContent
          conversation={selectedConversation}
          newMessage={newMessage}
          onNewMessageChange={onNewMessageChange}
          onSendMessage={onSendMessage}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          onReactToMessage={onReactToMessage}
        />
      </div>
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={() => {
                setShowNewMessageDialog(false);
                onSendMessage("New message");
              }}
              className="w-full"
            >
              Start New Conversation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
