
import { ConversationList } from "../ConversationList";
import { NewMessageDialog } from "../NewMessageDialog";
import { type Conversation } from "@/types/chat";
import { SearchInput } from "./SearchInput";
import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = searchQuery ? 
    conversations.filter(conv => 
      conv.participants.some(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) : 
    conversations;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 space-y-4">
        <SearchInput 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search conversations..." 
        />
        <NewMessageDialog />
      </div>
      <ConversationList
        conversations={filteredConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
}
