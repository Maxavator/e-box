import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { demoConversations } from "@/data/chat";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import type { Conversation } from "@/types/chat";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState(demoConversations);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setActiveTab('calendar');
  };

  return (
    <div className="flex-1 flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <ChatSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onCalendarActionClick={handleCalendarActionClick}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={75}>
          <div className="h-full p-6">
            <h1 className="text-2xl font-bold mb-4">Organization Dashboard</h1>
            {/* Organization dashboard content goes here */}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default OrganizationDashboard;
