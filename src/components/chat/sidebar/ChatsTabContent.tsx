
import { ConversationList } from "../ConversationList";
import { NewMessageDialog } from "../NewMessageDialog";
import { type Conversation } from "@/types/chat";

interface ChatsTabContentProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (id: string) => void;
}

export function ChatsTabContent({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ChatsTabContentProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <NewMessageDialog />
      </div>
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
}
