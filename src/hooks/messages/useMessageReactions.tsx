
import type { Conversation } from "@/types/chat";

export const useMessageReactions = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const handleReaction = (messageId: string, emoji: string) => {
    if (!selectedConversation || !selectedConversation.messages) return;

    const updatedConversation: Conversation = {
      ...selectedConversation,
      messages: selectedConversation.messages.map(m => {
        if (m.id !== messageId) return m;

        const reactions = m.reactions || {};
        const users = reactions[emoji] || [];
        
        if (users.includes('me')) {
          // Remove reaction
          const newUsers = users.filter(u => u !== 'me');
          
          const newReactions = {...reactions};
          if (newUsers.length === 0) {
            delete newReactions[emoji];
          } else {
            newReactions[emoji] = newUsers;
          }
          
          return {
            ...m,
            reactions: newReactions
          };
        } else {
          // Add reaction
          return {
            ...m,
            reactions: {
              ...reactions,
              [emoji]: [...users, 'me']
            }
          };
        }
      })
    };

    setSelectedConversation(updatedConversation);
  };

  return {
    handleReaction
  };
};
