
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  type: 'email' | 'chat' | 'call';
}

const messages: Message[] = [
  {
    id: '1',
    sender: {
      name: 'Alice Johnson',
      initials: 'AJ'
    },
    content: 'Updated the project timeline',
    timestamp: '10:30 AM',
    type: 'email'
  },
  {
    id: '2',
    sender: {
      name: 'Bob Smith',
      initials: 'BS'
    },
    content: 'Requested a meeting',
    timestamp: '11:45 AM',
    type: 'chat'
  },
  {
    id: '3',
    sender: {
      name: 'Carol White',
      initials: 'CW'
    },
    content: 'Left a voicemail',
    timestamp: '2:15 PM',
    type: 'call'
  }
];

const MessageIcon = ({ type }: { type: Message['type'] }) => {
  switch (type) {
    case 'email':
      return <Mail className="w-4 h-4" />;
    case 'chat':
      return <MessageSquare className="w-4 h-4" />;
    case 'call':
      return <Phone className="w-4 h-4" />;
  }
};

export function PartnerMessages() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div className="flex items-start space-x-4">
                  <Avatar>
                    {message.sender.avatar && (
                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    )}
                    <AvatarFallback>{message.sender.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{message.sender.name}</p>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.content}</p>
                  </div>
                  <MessageIcon type={message.type} />
                </div>
                {index < messages.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            View All Messages
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
