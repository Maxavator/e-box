import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Message, Conversation, Attachment } from "@/types/chat";
import { formatMessageTimestamp } from "./utils";
import { toast } from "sonner";

export const useMessageActions = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const { toast: uiToast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (attachments: Attachment[] = []) => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Validate that we have a proper UUID for conversation_id
      if (!selectedConversation.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedConversation.id)) {
        console.error('Invalid conversation ID format:', selectedConversation.id);
        toast.error("Invalid conversation format. Please try again or create a new conversation.");
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
          messages: [tempMessage],
          lastMessage: tempMessage
        });
      }

      // Clear message input
      setNewMessage("");

      // Check if this is a broadcast message (only for admins/mods)
      if (selectedConversation.isBroadcast) {
        // Check if user has permission to send broadcast
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const canBroadcast = userRole?.role === 'global_admin' || 
                           userRole?.role === 'org_admin' || 
                           userRole?.role === 'comm_moderator';
                           
        if (!canBroadcast) {
          toast({
            title: "Permission Denied",
            description: "Only admins and communication moderators can send broadcast messages",
            variant: "destructive"
          });
          
          // Remove temporary message
          if (selectedConversation.messages) {
            setSelectedConversation({
              ...selectedConversation,
              messages: selectedConversation.messages.filter(m => m.id !== tempMessageId)
            });
          }
          return;
        }
        
        // Send broadcast message
        const { data: broadcastData, error: broadcastError } = await supabase
          .from('broadcast_messages')
          .insert({
            sender_id: user.id,
            content: newMessage,
            organization_id: selectedConversation.organizationId || null,
            is_global: selectedConversation.isGlobal || false
          })
          .select()
          .single();
          
        if (broadcastError) {
          console.error('Error sending broadcast message:', broadcastError);
          toast({
            title: "Error",
            description: "Failed to send broadcast message",
            variant: "destructive"
          });
          return;
        }
        
        // Update temporary message with real message data
        const broadcastMsgObj: Message = {
          id: broadcastData.id,
          conversationId: selectedConversation.id,
          senderId: user.id,
          senderName: 'You (Broadcast)',
          content: broadcastData.content,
          text: broadcastData.content,
          timestamp: formatMessageTimestamp(broadcastData.created_at),
          status: 'sent',
          reactions: {},
          sender: 'me',
          isBroadcast: true,
          attachments: attachments
        };
        
        if (selectedConversation.messages) {
          setSelectedConversation({
            ...selectedConversation,
            messages: selectedConversation.messages.map(m => 
              m.id === tempMessageId ? broadcastMsgObj : m
            ),
            lastMessage: broadcastMsgObj
          });
        }
        
        toast({
          title: "Success",
          description: "Broadcast message sent successfully"
        });
        return;
      }

      // Send regular message to database
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
        
        toast.error("Failed to send message");
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
          messages: [newMessageObj],
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
      toast.error("An error occurred while sending your message");
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
