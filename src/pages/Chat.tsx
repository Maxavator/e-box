
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContent } from "@/components/chat/ChatContent";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { NewMessageDialog } from "@/components/chat/NewMessageDialog";
import { useChat } from "@/hooks/use-chat";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Updated import path
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Conversation, Message } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";

export default function Chat() {
  const { chatId } = useParams();
  const { isMobile, isDesktop } = useMediaQuery();
  const { 
    setShowSidebar, 
    showSidebar,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleSelectConversation
  } = useChat();
  const navigate = useNavigate();
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  
  // Get the current conversation if chatId is provided
  const { data: currentChat, isLoading: chatLoading } = useQuery({
    queryKey: ['conversation', chatId],
    queryFn: async () => {
      if (!chatId) return null;
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', chatId)
        .single();
        
      if (error) {
        console.error('Error fetching conversation:', error);
        return null;
      }
      
      return data as Conversation;
    },
    enabled: !!chatId,
  });
  
  // Get messages for the current conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', chatId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      
      return data as Message[];
    },
    enabled: !!chatId,
  });
  
  // Handle opening new message dialog
  const handleNewMessage = () => {
    setNewDialogOpen(true);
  };
  
  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  useEffect(() => {
    // Redirect to the first conversation if none is selected
    const redirectToFirstConversation = async () => {
      if (!chatId) {
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .limit(1);
          
        if (data && data.length > 0) {
          navigate(`/chat/${data[0].id}`);
        }
      }
    };
    
    redirectToFirstConversation();
  }, [chatId, navigate]);

  // Props for ChatContent component handling
  const handleEditMessage = (messageId: string, newContent: string) => {
    console.log('Edit message:', messageId, newContent);
    // Implement edit message functionality
  };

  const handleDeleteMessage = (messageId: string) => {
    console.log('Delete message:', messageId);
    // Implement delete message functionality
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    console.log('React to message:', messageId, emoji);
    // Implement react to message functionality
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile toggle for sidebar */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <MessageCircle /> : <Users />}
        </Button>
      )}

      {/* Chat sidebar - conditional based on state or screen size */}
      {(showSidebar || isDesktop) && (
        <div className={`${isMobile ? 'fixed inset-0 z-40 bg-background/80' : 'w-80 border-r'}`}>
          <ChatSidebar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            conversations={[]}
            selectedConversation={currentChat || null}
            onSelectConversation={handleConversationSelect}
            onCalendarActionClick={() => {}}
          />
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        {chatId && currentChat ? (
          <ChatContent 
            conversation={currentChat}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onReactToMessage={handleReactToMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Card className="max-w-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground mb-4">
                Choose an existing conversation from the sidebar or start a new one.
              </p>
              <Button onClick={handleNewMessage} className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" /> New Message
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* New message dialog */}
      <NewMessageDialog 
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onSelectConversation={handleConversationSelect}
      />
    </div>
  );
}

