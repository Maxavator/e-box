
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageList } from "./MessageList";
import type { Conversation, Message } from "@/types/chat";
import { getUserById } from "@/data/chat";
import { Shield } from "lucide-react";

export interface ChatContentProps {
  conversation: Conversation | null;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  isAdminChat?: boolean;
  isNewConversation?: boolean;
  messages?: Message[];
}

export function ChatContent({
  conversation,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  isAdminChat = false,
  isNewConversation = false,
  messages = [],
}: ChatContentProps) {
  if (!conversation) return null;
  
  const user = getUserById(conversation.userId || '');

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b">
          {isAdminChat || conversation.isGroup ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{conversation.groupName || "e-Box Admin Group"}</h3>
                <p className="text-xs text-muted-foreground">Secure admin communication channel</p>
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.initials || (user?.name ? user.name.substring(0, 2) : 'UN')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-xs text-muted-foreground">{user?.status}</p>
              </div>
            </>
          )}
        </div>
        
        <MessageList
          messages={conversation.messages || messages}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          onReactToMessage={onReactToMessage}
          isAdminChat={isAdminChat}
          isNewConversation={isNewConversation}
        />
      </div>
    </div>
  );
}
