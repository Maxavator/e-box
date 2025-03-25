import type { Conversation } from "@/types/chat";

export const useMessageEditing = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!selectedConversation) return;

    // For conversations with the messages array
    if (selectedConversation.messages) {
      const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: selectedConversation.messages.map(m =>
          m.id === messageId
            ? { ...m, content: newContent, text: newContent, isEdited: true, edited: true }
            : m
        ),
      };

      setSelectedConversation(updatedConversation);
    }
    // Otherwise, we'd need to update the message in the database
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedConversation || !selectedConversation.messages) return;

    const updatedMessages = selectedConversation.messages.filter(m => m.id !== messageId);
    const updatedConversation: Conversation = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage: updatedMessages.length > 0 
        ? updatedMessages[updatedMessages.length - 1] 
        : "No messages"
    };

    setSelectedConversation(updatedConversation);
  };

  return {
    handleEditMessage,
    handleDeleteMessage
  };
};
