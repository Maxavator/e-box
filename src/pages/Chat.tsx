import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageSquare, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { CalendarView } from "@/components/calendar/CalendarView";
import type { Message, Conversation } from "@/types/chat";
import { demoUsers, demoConversations, getUserById } from "@/data/chat";

const Chat = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    setActiveTab("chats");
    setSelectedConversation(null);
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

    setNewMessage("");

    // Simulate message sending
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
  };

  const handleDeleteMessage = (messageId: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.filter(m => m.id !== messageId)
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
          
          const existingReaction = m.reactions?.find(r => r.emoji === emoji);
          const reactions = m.reactions || [];
          
          if (existingReaction) {
            if (existingReaction.users.includes('me')) {
              // Remove reaction
              return {
                ...m,
                reactions: reactions
                  .map(r => r.emoji === emoji ? 
                    { ...r, users: r.users.filter(u => u !== 'me') } : r)
                  .filter(r => r.users.length > 0)
              };
            } else {
              // Add user to existing reaction
              return {
                ...m,
                reactions: reactions.map(r => 
                  r.emoji === emoji ? 
                  { ...r, users: [...r.users, 'me'] } : r
                )
              };
            }
          } else {
            // Add new reaction
            return {
              ...m,
              reactions: [...reactions, { emoji, users: ['me'] }]
            };
          }
        })
      };
    });
  };

  const filteredConversations = demoConversations.filter(conversation => {
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
      
      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-gray-50 flex flex-col">
          <div className="p-4">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="chats"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chats" className="flex-1 p-0">
              <ConversationList
                conversations={filteredConversations}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
              />
            </TabsContent>
          </Tabs>
        </aside>

        <main className="flex-1 flex flex-col">
          {activeTab === "chats" ? (
            selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">
                        {getUserById(selectedConversation.userId)?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getUserById(selectedConversation.userId)?.status}
                      </p>
                    </div>
                  </div>
                </div>

                <MessageList
                  messages={selectedConversation.messages}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onReactToMessage={handleReaction}
                />

                <ChatInput
                  value={newMessage}
                  onChange={setNewMessage}
                  onSend={handleSendMessage}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )
          ) : (
            <CalendarView />
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
