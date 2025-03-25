
import { useMessageActions } from "./useMessageActions";
import { useMessageEditing } from "./useMessageEditing";
import { useMessageReactions } from "./useMessageReactions";
import type { Conversation } from "@/types/chat";

export const useMessages = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const { newMessage, setNewMessage, handleSendMessage } = useMessageActions(
    selectedConversation,
    setSelectedConversation
  );
  
  const { handleEditMessage, handleDeleteMessage } = useMessageEditing(
    selectedConversation,
    setSelectedConversation
  );
  
  const { handleReaction } = useMessageReactions(
    selectedConversation,
    setSelectedConversation
  );

  return {
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction
  };
};

export * from "./utils";
