
import { useState } from "react";
import { AppHeader } from "@/components/shared/AppHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ChatContent } from "./ChatContent";
import { ChatInput } from "./ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Conversation } from "@/types/chat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// Create a client for components using ChatLayout
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

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
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  calendarView: 'calendar' | 'inbox';
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
  const [activeContent, setActiveContent] = useState<'chat' | 'sidebar'>('chat');

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen w-full">
          <AppHeader onLogout={onLogout} onLogoClick={onLogoClick} />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            {/* Chat container */}
            <div className="flex flex-1 overflow-hidden">
              {/* Chat sidebar */}
              <div className={`${isMobile && activeContent === 'chat' ? 'hidden' : 'w-full sm:w-80 border-r'} h-[calc(100vh-4rem)]`}>
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
              </div>
              
              {/* Chat content */}
              <div className={`${isMobile && activeContent === 'sidebar' ? 'hidden' : 'flex-1'} h-[calc(100vh-4rem)]`}>
                {selectedConversation ? (
                  <div className="flex flex-col h-full">
                    <ChatContent
                      conversation={selectedConversation}
                      onEditMessage={onEditMessage}
                      onDeleteMessage={onDeleteMessage}
                      onReactToMessage={onReactToMessage}
                    />
                    <ChatInput
                      value={newMessage}
                      onChange={onNewMessageChange}
                      onSendMessage={onSendMessage}
                    />
                  </div>
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
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
