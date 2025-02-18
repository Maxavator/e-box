
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContent } from "@/components/chat/ChatContent";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/components/ui/use-toast";
import { demoConversations, getUserById } from "@/data/chat";
import type { Message, Conversation } from "@/types/chat";
import Dashboard from "./Dashboard";
import { Settings } from "@/components/desk/Settings";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [calendarView, setCalendarView] = useState<"calendar" | "inbox">("calendar");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState(demoConversations);
  const [selectedFeature, setSelectedFeature] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = demoConversations[Math.floor(Math.random() * demoConversations.length)];
      const user = getUserById(randomUser.userId);
      
      if (user) {
        setConversations(prevConversations => 
          prevConversations.map(conv => {
            if (conv.userId === randomUser.userId) {
              const newMessage: Message = {
                id: Math.random().toString(),
                senderId: user.id,
                text: `Random message from ${user.name}`,
                timestamp: new Date().toISOString(),
                status: 'sent',
                sender: 'them',
                reactions: []
              };

              return {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: newMessage.text,
                unreadCount: selectedConversation?.id === conv.id ? 0 : (conv.unreadCount + 1)
              };
            }
            return conv;
          })
        );

        if (selectedConversation?.userId !== randomUser.userId) {
          toast({
            title: "New Message",
            description: `New message from ${user.name}`
          });
        }
      }
    }, Math.random() * 15000 + 15000);

    return () => clearInterval(interval);
  }, [selectedConversation, toast]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setCalendarView(view);
    setActiveTab('calendar');
  };

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
      sender: 'me',
      reactions: []
    };

    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: message.text
      };
    });

    setNewMessage("");

    setTimeout(() => {
      setSelectedConversation(prev => {
        if (!prev) return prev;
        const user = getUserById(prev.userId);
        if (!user) return prev;

        const reply: Message = {
          id: Math.random().toString(),
          senderId: user.id,
          text: `Reply from ${user.name}`,
          timestamp: new Date().toISOString(),
          status: 'sent',
          sender: 'them',
          reactions: []
        };

        return {
          ...prev,
          messages: [...prev.messages, reply],
          lastMessage: reply.text
        };
      });
    }, 1000);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m =>
          m.id === messageId
            ? { ...m, text: newContent, edited: true }
            : m
        ),
      };
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      const updatedMessages = prev.messages.filter(m => m.id !== messageId);
      return {
        ...prev,
        messages: updatedMessages,
        lastMessage: updatedMessages[updatedMessages.length - 1]?.text ?? ''
      };
    });
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== messageId) return m;

          const reactions = [...m.reactions];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            if (existingReaction.users.includes('me')) {
              return {
                ...m,
                reactions: reactions
                  .map(r => r.emoji === emoji ? { ...r, users: r.users.filter(u => u !== 'me') } : r)
                  .filter(r => r.users.length > 0)
              };
            } else {
              return {
                ...m,
                reactions: reactions.map(r => 
                  r.emoji === emoji ? { ...r, users: [...r.users, 'me'] } : r
                )
              };
            }
          } else {
            return {
              ...m,
              reactions: [...reactions, { emoji, users: ['me'] }]
            };
          }
        })
      };
    });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    const updatedConversation = { ...conversation, unreadCount: 0 };
    setSelectedConversation(updatedConversation);
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversation.id 
          ? updatedConversation
          : conv
      )
    );
  };

  const filteredConversations = conversations.filter(conversation => {
    const user = getUserById(conversation.userId);
    const searchLower = searchQuery.toLowerCase();
    return (
      user &&
      (user.name.toLowerCase().includes(searchLower) ||
        conversation.lastMessage.toLowerCase().includes(searchLower))
    );
  });

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return <Dashboard />;
    }

    if (activeTab === "desk" && selectedFeature === "settings") {
      return <Settings />;
    }

    return (
      <ChatContent
        activeTab={activeTab}
        selectedConversation={selectedConversation}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onReactToMessage={handleReaction}
        calendarView={calendarView}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
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
          {renderContent()}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
