import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContent } from "@/components/chat/ChatContent";
import type { Message, Conversation } from "@/types/chat";
import { demoConversations, getUserById } from "@/data/chat";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { toast } from "sonner";

const Chat = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [calendarView, setCalendarView] = useState<'calendar' | 'inbox'>('calendar');
  const [conversations, setConversations] = useState(demoConversations);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = demoConversations[Math.floor(Math.random() * demoConversations.length)];
      const user = getUserById(randomUser.userId);
      
      if (user) {
        const newMessage: Message = {
          id: `${Date.now()}`,
          senderId: user.id,
          text: `New update from ${user.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };

        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.userId === user.id 
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  unreadCount: selectedConversation?.userId !== user.id 
                    ? conv.unreadCount + 1 
                    : conv.unreadCount
                }
              : conv
          )
        );

        if (selectedConversation?.userId !== user.id) {
          toast(`New message from ${user.name}`);
        }
      }
    }, Math.random() * 15000 + 15000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    setActiveTab("chats");
    setSelectedConversation(null);
  };

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setActiveTab("calendar");
    setCalendarView(view);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `${Date.now()}`,
      senderId: 'me',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, message]
      };
    });

    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );

    setNewMessage("");

    setTimeout(() => {
      setSelectedConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map(m => 
            m.id === message.id ? { ...m, status: 'sent' } : m
          )
        };
      });

      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                messages: conv.messages.map(m => 
                  m.id === message.id ? { ...m, status: 'sent' } : m
                )
              }
            : conv
        )
      );
    }, 1000);
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m => 
          m.id === messageId ? 
          { 
            ...m, 
            text: newText, 
            edited: true, 
            editedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } : m
        )
      };
    });

    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation?.id 
          ? {
              ...conv,
              messages: conv.messages.map(m => 
                m.id === messageId ? 
                { 
                  ...m, 
                  text: newText, 
                  edited: true, 
                  editedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                } : m
              )
            }
          : conv
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.filter(m => m.id !== messageId)
      };
    });

    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation?.id 
          ? {
              ...conv,
              messages: conv.messages.filter(m => m.id !== messageId)
            }
          : conv
      )
    );
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== messageId) return m;
          
          const existingReaction = m.reactions?.find(r => r.emoji === emoji);
          const reactions = m.reactions || [];
          
          if (existingReaction) {
            if (existingReaction.users.includes('me')) {
              return {
                ...m,
                reactions: reactions
                  .map(r => r.emoji === emoji ? 
                    { ...r, users: r.users.filter(u => u !== 'me') } : r)
                  .filter(r => r.users.length > 0)
              };
            } else {
              return {
                ...m,
                reactions: reactions.map(r => 
                  r.emoji === emoji ? 
                  { ...r, users: [...r.users, 'me'] } : r
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

    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation?.id 
          ? { ...conv, messages: conv.messages.map(m => {
              if (m.id !== messageId) return m;
              
              const existingReaction = m.reactions?.find(r => r.emoji === emoji);
              const reactions = m.reactions || [];
              
              if (existingReaction) {
                if (existingReaction.users.includes('me')) {
                  return {
                    ...m,
                    reactions: reactions
                      .map(r => r.emoji === emoji ? 
                        { ...r, users: r.users.filter(u => u !== 'me') } : r)
                      .filter(r => r.users.length > 0)
                  };
                } else {
                  return {
                    ...m,
                    reactions: reactions.map(r => 
                      r.emoji === emoji ? 
                      { ...r, users: [...r.users, 'me'] } : r
                    )
                  };
                }
              } else {
                return {
                  ...m,
                  reactions: [...reactions, { emoji, users: ['me'] }]
                };
              }
            })}
          : conv
      )
    );
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
    
    return user?.name.toLowerCase().includes(searchLower) ||
           conversation.messages.some(message => 
             message.text.toLowerCase().includes(searchLower) ||
             message.timestamp.toLowerCase().includes(searchLower)
           );
  });

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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
