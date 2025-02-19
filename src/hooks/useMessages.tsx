
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

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
      senderId: user.id,
      text: messageData.content,
      timestamp: messageData.created_at,
      status: 'sent',
      reactions: [],
      sender: 'me'
    };

    const updatedConversation: Conversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessageObj],
      lastMessage: newMessage
    };

    setSelectedConversation(updatedConversation);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!selectedConversation) return;

    const updatedConversation: Conversation = {
      ...selectedConversation,
      messages: selectedConversation.messages.map(m =>
        m.id === messageId
          ? { ...m, text: newContent, edited: true }
          : m
      ),
    };

    setSelectedConversation(updatedConversation);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedConversation) return;

    const updatedMessages = selectedConversation.messages.filter(m => m.id !== messageId);
    const updatedConversation: Conversation = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage: updatedMessages[updatedMessages.length - 1]?.text ?? ''
    };

    setSelectedConversation(updatedConversation);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!selectedConversation) return;

    const updatedConversation: Conversation = {
      ...selectedConversation,
      messages: selectedConversation.messages.map(m => {
        if (m.id !== messageId) return m;

        const reactions = [...m.reactions];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes('me')) {
            return {
              ...m,
              reactions: reactions
                .map(r => r.emoji === emoji ? { ...r, users: r.users.filter(u => u !== 'me') } : r)
                .filter(r => r.users.length > 0)
            };
          } else {
            return {
              ...m,
              reactions: reactions.map(r => 
                r.emoji === emoji ? { ...r, users: [...r.users, 'me'] } : r
              )
            };
          }
        } else {
          return {
            ...m,
            reactions: [...reactions, { emoji, users: ['me'] }]
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
