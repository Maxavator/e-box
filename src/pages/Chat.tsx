
import { MessageSquare, LogOut, Send, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import MessageItem from "@/components/chat/MessageItem";
import { User, Message, Conversation } from "@/types/chat";

// Demo data
const demoUsers: User[] = [
  { id: '1', name: 'Sarah Chen', status: 'online' },
  { id: '2', name: 'Mike Johnson', status: 'offline', lastSeen: '2 hours ago' },
  { id: '3', name: 'Emma Wilson', status: 'online' },
  { id: '4', name: 'Alex Rodriguez', status: 'offline', lastSeen: '1 day ago' },
  { id: '5', name: 'David Kim', status: 'online' },
];

const demoConversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    unreadCount: 2,
    messages: [
      { id: '1', senderId: '1', text: 'Hi, could you review the latest design updates?', timestamp: '10:30 AM', status: 'sent' },
      { id: '2', senderId: 'me', text: 'Sure, I\'ll take a look right now', timestamp: '10:32 AM', status: 'sent' },
      { id: '3', senderId: '1', text: 'Thanks! Let me know what you think', timestamp: '10:33 AM', status: 'sent' },
    ]
  },
  {
    id: '2',
    userId: '2',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: '2', text: 'Team meeting at 3 PM today', timestamp: '9:00 AM', status: 'sent' },
      { id: '2', senderId: 'me', text: 'I\'ll be there', timestamp: '9:05 AM', status: 'sent' },
    ]
  },
  {
    id: '3',
    userId: '3',
    unreadCount: 1,
    messages: [
      { id: '1', senderId: '3', text: 'Did you see the new project requirements?', timestamp: '11:20 AM', status: 'sent' },
    ]
  },
  {
    id: '4',
    userId: '4',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: '4', text: 'Great presentation yesterday!', timestamp: 'Yesterday', status: 'sent' },
      { id: '2', senderId: 'me', text: 'Thanks! Glad it went well', timestamp: 'Yesterday', status: 'sent' },
    ]
  },
  {
    id: '5',
    userId: '5',
    unreadCount: 3,
    messages: [
      { id: '1', senderId: '5', text: 'Can we discuss the new feature?', timestamp: '12:45 PM', status: 'sent' },
      { id: '2', senderId: '5', text: 'I have some ideas to share', timestamp: '12:46 PM', status: 'sent' },
      { id: '3', senderId: '5', text: 'Let me know when you\'re free', timestamp: '12:47 PM', status: 'sent' },
    ]
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    navigate("/");
  };

  const getUserById = (id: string) => demoUsers.find(user => user.id === id);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const filteredConversations = demoConversations.filter(conversation => {
    const user = getUserById(conversation.userId);
    const searchLower = searchQuery.toLowerCase();
    
    // Search in user name
    const nameMatch = user?.name.toLowerCase().includes(searchLower);
    
    // Search in message content
    const messageMatch = conversation.messages.some(message => 
      message.text.toLowerCase().includes(searchLower)
    );
    
    // Search in timestamp
    const timestampMatch = conversation.messages.some(message =>
      message.timestamp.toLowerCase().includes(searchLower)
    );

    // Return true if any of the search criteria match
    return nameMatch || messageMatch || timestampMatch;
  });

  // Highlight matching text in the conversation list
  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={index} className="bg-yellow-200">{part}</span> : part
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-semibold">Enterprise Chat</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>
      <div className="flex-1 flex">
        <aside className="w-80 border-r bg-white">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Conversations</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search messages, names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {filteredConversations.length} results
                </div>
              )}
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {filteredConversations.map((conversation) => {
                const user = getUserById(conversation.userId);
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                
                // Find the first matching message for preview
                const matchingMessage = searchQuery ? 
                  conversation.messages.find(msg => 
                    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
                  ) : lastMessage;
                
                const previewMessage = matchingMessage || lastMessage;
                
                return (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar>
                      <AvatarFallback>{user?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {highlightText(user?.name || '')}
                        </p>
                        <span className="text-xs text-gray-500">
                          {highlightText(previewMessage.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {highlightText(previewMessage.text)}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {searchQuery && filteredConversations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No conversations found matching "{searchQuery}"
                </div>
              )}
            </ScrollArea>
          </div>
        </aside>
        <main className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <div className="flex-1 flex flex-col">
              <div className="border-b bg-white p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getUserById(selectedConversation.userId)?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{getUserById(selectedConversation.userId)?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {getUserById(selectedConversation.userId)?.status === 'online' 
                        ? 'Online' 
                        : `Last seen ${getUserById(selectedConversation.userId)?.lastSeen}`}
                    </p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      isMine={message.senderId === 'me'}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      onReaction={handleReaction}
                    />
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
