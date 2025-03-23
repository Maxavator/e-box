
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/types/chat";

export const useRealtime = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const { toast } = useToast();

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

  useEffect(() => {
    if (!selectedConversation) return;

    // Enable REALTIME for messages table
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const newMessage = payload.new;
          
          // Transform the message to match our Message type
          const messageObj: Message = {
            id: newMessage.id,
            conversationId: newMessage.conversation_id,
            senderId: newMessage.sender_id,
            senderName: '', // Will be filled later if needed
            content: newMessage.content,
            text: newMessage.content, // For backwards compatibility
            timestamp: formatTimestamp(newMessage.created_at),
            status: 'sent',
            reactions: {},
            sender: newMessage.sender_id === user.id ? 'me' : 'them' // For backwards compatibility
          };

          // Update the conversation with the new message
          setSelectedConversation(prev => {
            if (!prev) return null;
            
            if (prev.messages) {
              return {
                ...prev,
                messages: [...prev.messages, messageObj],
                lastMessage: messageObj
              };
            } else {
              return {
                ...prev,
                lastMessage: messageObj
              };
            }
          });

          // Show notification for messages from others
          if (newMessage.sender_id !== user.id) {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', newMessage.sender_id)
              .single();

            if (senderProfile) {
              toast({
                title: "New Message",
                description: `From ${senderProfile.first_name} ${senderProfile.last_name}`
              });
            }
          }
        }
      )
      .subscribe();

    console.log('Realtime subscription started for conversation:', selectedConversation.id);

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id, setSelectedConversation, toast]);
};
