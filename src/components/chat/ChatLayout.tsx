
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatSidebar } from "./ChatSidebar";
import { ChatContent } from "./ChatContent";
import { AppHeader } from "@/components/shared/AppHeader";
import type { Conversation } from "@/types/chat";

interface ChatLayoutProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCalendarActionClick: (view: 'calendar' | 'inbox') => void;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  calendarView: 'calendar' | 'inbox';
  onLogout: () => void;
  onLogoClick: () => void;
}

export const ChatLayout = ({
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
}: ChatLayoutProps) => {
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader onLogout={onLogout} onLogoClick={onLogoClick} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <ChatSidebar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeTab={activeTab}
            onTabChange={onTabChange}
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={onSelectConversation}
            onCalendarActionClick={onCalendarActionClick}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={75}>
          <ChatContent
            activeTab={activeTab}
            selectedConversation={selectedConversation}
            newMessage={newMessage}
            onNewMessageChange={onNewMessageChange}
            onSendMessage={onSendMessage}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onReactToMessage={onReactToMessage}
            calendarView={calendarView}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
