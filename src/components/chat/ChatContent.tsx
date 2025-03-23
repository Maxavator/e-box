
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar as CalendarIcon, MessageCircle, User } from "lucide-react";
import type { Conversation } from "@/types/chat";

interface ChatContentProps {
  activeTab: string;
  selectedConversation: Conversation | null;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  calendarView: 'calendar' | 'inbox';
}

export const ChatContent = ({
  selectedConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
}: ChatContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  if (!selectedConversation) {
    return (
      <div className="h-full p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Welcome to your Messages</h2>
          <p className="text-muted-foreground mb-8">
            Select a conversation from the sidebar or start a new chat to begin messaging.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Team meeting scheduled for tomorrow</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>3 unread messages from Sarah</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Document shared by Marketing team</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Messages today</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active chats</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team members online</span>
                    <span className="font-semibold">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<FileText className="w-5 h-5" />}
              title="Documents"
              description="Access shared files"
            />
            <QuickActionCard
              icon={<CalendarIcon className="w-5 h-5" />}
              title="Calendar"
              description="View schedule"
            />
            <QuickActionCard
              icon={<MessageCircle className="w-5 h-5" />}
              title="New Message"
              description="Start a chat"
            />
            <QuickActionCard
              icon={<User className="w-5 h-5" />}
              title="Profile"
              description="Update settings"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {selectedConversation.messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onEdit={(newText) => onEditMessage(message.id, newText)}
            onDelete={() => onDeleteMessage(message.id)}
            onReact={(emoji) => onReactToMessage(message.id, emoji)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSend={onSendMessage}
      />
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const QuickActionCard = ({ icon, title, description }: QuickActionCardProps) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardHeader className="space-y-1.5 p-4">
      <div className="p-2 w-fit rounded-lg bg-primary/10">
        {icon}
      </div>
      <CardTitle className="text-base">{title}</CardTitle>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardHeader>
  </Card>
);
