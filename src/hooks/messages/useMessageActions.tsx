
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Message, Conversation, Attachment } from "@/types/chat";
import { formatMessageTimestamp } from "./utils";

export const useMessageActions = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (attachments: Attachment[] = []) => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Validate that we have a proper UUID for conversation_id
      if (!selectedConversation.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedConversation.id)) {
        console.error('Invalid conversation ID format:', selectedConversation.id);
        toast({
          title: "Error",
          description: "Invalid conversation format. Please try again or create a new conversation.",
          variant: "destructive"
        });
        return;
      }

      // Create a temporary message with sending status
      const tempMessageId = crypto.randomUUID();
      const tempMessage: Message = {
        id: tempMessageId,
        conversationId: selectedConversation.id,
        senderId: user.id,
        senderName: 'You', // Could be improved with actual user name from profile
        content: newMessage,
        text: newMessage, // For backwards compatibility
        timestamp: formatMessageTimestamp(new Date().toISOString()),
        status: 'sending',
        reactions: {},
        sender: 'me', // For backwards compatibility
        attachments: attachments
      };

      // Add temporary message to conversation
      if (selectedConversation.messages) {
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, tempMessage],
          lastMessage: tempMessage
        });
      } else {
        setSelectedConversation({
          ...selectedConversation,
          lastMessage: tempMessage
        });
      }

      // Clear message input
      setNewMessage("");

      // Actually send message to database
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
        
        // Update message status to failed
        if (selectedConversation.messages) {
          setSelectedConversation({
            ...selectedConversation,
            messages: selectedConversation.messages.map(m => 
              m.id === tempMessageId ? { ...m, status: 'failed' } : m
            )
          });
        }
        
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return;
      }

      // Update temporary message with real message data and sent status
      const newMessageObj: Message = {
        id: messageData.id,
        conversationId: selectedConversation.id,
        senderId: user.id,
        senderName: 'You', // Could be improved with actual user name from profile
        content: messageData.content,
        text: messageData.content, // For backwards compatibility
        timestamp: formatMessageTimestamp(messageData.created_at),
        status: 'sent',
        reactions: {},
        sender: 'me', // For backwards compatibility
        attachments: attachments
      };

      // Update conversation with confirmed message
      if (selectedConversation.messages) {
        setSelectedConversation({
          ...selectedConversation,
          messages: selectedConversation.messages.map(m => 
            m.id === tempMessageId ? newMessageObj : m
          ),
          lastMessage: newMessageObj
        });
      } else {
        setSelectedConversation({
          ...selectedConversation,
          lastMessage: newMessageObj
        });
      }

      // Simulate message delivery after a delay
      setTimeout(() => {
        if (selectedConversation.messages) {
          setSelectedConversation(prev => {
            if (!prev) return null;
            return {
              ...prev,
              messages: prev.messages?.map(m => 
                m.id === messageData.id ? { ...m, status: 'delivered' } : m
              ) || []
            };
          });
        }
      }, 1000);

      // Simulate message read after a longer delay
      setTimeout(() => {
        if (selectedConversation.messages) {
          setSelectedConversation(prev => {
            if (!prev) return null;
            return {
              ...prev,
              messages: prev.messages?.map(m => 
                m.id === messageData.id ? { ...m, status: 'read' } : m
              ) || []
            };
          });
        }
      }, 3000);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
