
import { MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Demo data types
interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  unreadCount: number;
}

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
      { id: '1', senderId: '1', text: 'Hi, could you review the latest design updates?', timestamp: '10:30 AM' },
      { id: '2', senderId: 'me', text: 'Sure, I'll take a look right now', timestamp: '10:32 AM' },
      { id: '3', senderId: '1', text: 'Thanks! Let me know what you think', timestamp: '10:33 AM' },
    ]
  },
  {
    id: '2',
    userId: '2',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: '2', text: 'Team meeting at 3 PM today', timestamp: '9:00 AM' },
      { id: '2', senderId: 'me', text: 'I'll be there', timestamp: '9:05 AM' },
    ]
  },
  {
    id: '3',
    userId: '3',
    unreadCount: 1,
    messages: [
      { id: '1', senderId: '3', text: 'Did you see the new project requirements?', timestamp: '11:20 AM' },
    ]
  },
  {
    id: '4',
    userId: '4',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: '4', text: 'Great presentation yesterday!', timestamp: 'Yesterday' },
      { id: '2', senderId: 'me', text: 'Thanks! Glad it went well', timestamp: 'Yesterday' },
    ]
  },
  {
    id: '5',
    userId: '5',
    unreadCount: 3,
    messages: [
      { id: '1', senderId: '5', text: 'Can we discuss the new feature?', timestamp: '12:45 PM' },
      { id: '2', senderId: '5', text: 'I have some ideas to share', timestamp: '12:46 PM' },
      { id: '3', senderId: '5', text: 'Let me know when you're free', timestamp: '12:47 PM' },
    ]
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleLogout = () => {
    navigate("/");
  };

  const getUserById = (id: string) => demoUsers.find(user => user.id === id);

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
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {demoConversations.map((conversation) => {
                const user = getUserById(conversation.userId);
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                
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
                        <p className="font-medium truncate">{user?.name}</p>
                        <span className="text-xs text-gray-500">{lastMessage.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">{lastMessage.text}</p>
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
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <p>{message.text}</p>
                        <span className={`text-xs ${
                          message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
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
