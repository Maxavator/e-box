
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Message, Conversation } from "@/types/chat";

export const useMessages = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  // Helper function to format timestamp without seconds
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return;
      }

      setNewMessage("");

      const newMessageObj: Message = {
        id: messageData.id,
        conversationId: selectedConversation.id,
        senderId: user.id,
        senderName: 'You', // Could be improved with actual user name from profile
        content: messageData.content,
        text: messageData.content, // For backwards compatibility
        timestamp: formatTimestamp(messageData.created_at),
        status: 'sent',
        reactions: {},
        sender: 'me' // For backwards compatibility
      };

      // Handle updating the conversation with the new message
      if (selectedConversation.messages) {
        // For conversations with the messages array
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, newMessageObj],
          lastMessage: newMessageObj
        });
      } else {
        // For conversations without the messages array
        setSelectedConversation({
          ...selectedConversation,
          lastMessage: newMessageObj
        });
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

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
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction
  };
};
