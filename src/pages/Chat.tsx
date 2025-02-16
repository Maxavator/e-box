import { MessageSquare, LogOut, Send, Search, User, LayoutDashboard, MessageCircle, Calendar, Users, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MessageItem from "@/components/chat/MessageItem";
import { CalendarView } from "@/components/calendar/CalendarView";
import type { User as ChatUser, Message, Conversation } from "@/types/chat";

const demoUsers: ChatUser[] = [
  {
    id: "1",
    name: "John Doe",
    title: "Software Engineer",
    avatar: "/avatars/1.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "Product Manager",
    avatar: "/avatars/2.png",
  },
  {
    id: "3",
    name: "Mike Johnson",
    title: "UX Designer",
    avatar: "/avatars/3.png",
  },
  {
    id: "4",
    name: "Emily Brown",
    title: "Data Scientist",
    avatar: "/avatars/4.png",
  },
];

const demoConversations: Conversation[] = [
  {
    id: "101",
    user: demoUsers[0],
    lastMessage: "Hey, how's the project going?",
    messages: [
      {
        senderId: "1",
        text: "Hey, how's the project going?",
        timestamp: "2024-03-17T10:30:00",
      },
      {
        senderId: "currentUser",
        text: "It's coming along nicely! Just finished the UI.",
        timestamp: "2024-03-17T10:32:00",
      },
    ],
  },
  {
    id: "102",
    user: demoUsers[1],
    lastMessage: "Can we schedule a meeting for next week?",
    messages: [
      {
        senderId: "2",
        text: "Can we schedule a meeting for next week?",
        timestamp: "2024-03-16T15:45:00",
      },
      {
        senderId: "currentUser",
        text: "Sure, let me check my calendar.",
        timestamp: "2024-03-16T15:47:00",
      },
    ],
  },
  {
    id: "103",
    user: demoUsers[2],
    lastMessage: "I have some feedback on the latest designs.",
    messages: [
      {
        senderId: "3",
        text: "I have some feedback on the latest designs.",
        timestamp: "2024-03-15T09:10:00",
      },
      {
        senderId: "currentUser",
        text: "Great, I'm all ears!",
        timestamp: "2024-03-15T09:12:00",
      },
    ],
  },
  {
    id: "104",
    user: demoUsers[3],
    lastMessage: "The data analysis is complete.",
    messages: [
      {
        senderId: "4",
        text: "The data analysis is complete.",
        timestamp: "2024-03-14T14:20:00",
      },
      {
        senderId: "currentUser",
        text: "Awesome, can you send me the report?",
        timestamp: "2024-03-14T14:22:00",
      },
    ],
  },
];

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
    navigate("/organization");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    if (selectedConversation) {
      const newMessageItem: Message = {
        senderId: "currentUser",
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessageItem],
        lastMessage: newMessage,
      });
    }

    setNewMessage("");
  };

  const filteredConversations = demoConversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/cea5cf65-708e-42c4-9a6c-6073f42a3471.png" 
            alt="e-Box Logo" 
            className="h-8 cursor-pointer"
            onClick={handleLogoClick}
          />
          <h1 className="text-xl font-semibold">Enterprise Chat</h1>
        </div>
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
              <ScrollArea className="h-[calc(100vh-8.5rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 ${
                      selectedConversation?.id === conversation.id
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {conversation.user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{conversation.user.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="calendar" className="flex-1 p-0">
              <CalendarView />
            </TabsContent>
          </Tabs>
        </aside>

        <main className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConversation.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedConversation.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.user.title}
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message, index) => (
                    <MessageItem key={index} message={message} />
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : activeTab === "chats" ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Chat;
