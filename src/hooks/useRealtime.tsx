
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/types/chat";

export const useRealtime = (
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const { toast } = useToast();

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
            senderId: newMessage.sender_id,
            text: newMessage.content,
            timestamp: new Date(newMessage.created_at).toLocaleString(),
            status: 'sent',
            reactions: [],
            sender: newMessage.sender_id === user.id ? 'me' : 'them'
          };

          // Update the conversation with the new message
          setSelectedConversation(prev => {
            if (!prev) return null;
            return {
              ...prev,
              messages: [...prev.messages, messageObj],
              lastMessage: newMessage.content
            };
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
