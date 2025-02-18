
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/types/chat";

export const useRealtime = (
  selectedConversation: Conversation | null,
  setSelectedConversation: (conversation: Conversation | null) => void
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
          if (!user) return;

          const newMessage = payload.new;
          
          if (selectedConversation?.id === newMessage.conversation_id) {
            setSelectedConversation(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                messages: [...prev.messages, {
                  id: newMessage.id,
                  senderId: newMessage.sender_id,
                  text: newMessage.content,
                  timestamp: newMessage.created_at,
                  status: 'sent',
                  reactions: [],
                  sender: newMessage.sender_id === user.id ? 'me' : 'them'
                }],
                lastMessage: newMessage.content
              };
            });

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
