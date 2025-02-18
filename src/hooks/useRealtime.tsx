
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
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload: any) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || !selectedConversation) return;

          const newMessage = payload.new;
          
          if (selectedConversation.id === newMessage.conversation_id) {
            const newMessageObj: Message = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              text: newMessage.content,
              timestamp: newMessage.created_at,
              status: 'sent',
              reactions: [],
              sender: newMessage.sender_id === user.id ? 'me' : 'them'
            };

            const updatedConversation: Conversation = {
              ...selectedConversation,
              messages: [...selectedConversation.messages, newMessageObj],
              lastMessage: newMessage.content
            };

            setSelectedConversation(updatedConversation);

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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id, setSelectedConversation, toast]);
};
