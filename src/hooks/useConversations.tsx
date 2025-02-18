
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/types/chat";
import { getUserById } from "@/data/chat";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: convos, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          created_at,
          updated_at
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Transform conversations
      const transformedConvos: Conversation[] = await Promise.all(
        convos.map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', otherUserId)
            .single();

          return {
            id: conv.id,
            userId: otherUserId,
            unreadCount: 0,
            messages: [],
            lastMessage: ''
          };
        })
      );

      setConversations(transformedConvos);
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = async (conversation: Conversation) => {
    const updatedConversation = { ...conversation, unreadCount: 0 };
    setSelectedConversation(updatedConversation);
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversation.id 
          ? updatedConversation
          : conv
      )
    );
  };

  const filteredConversations = conversations.filter(conversation => {
    const user = getUserById(conversation.userId);
    const searchLower = searchQuery.toLowerCase();
    return (
      user &&
      (user.name.toLowerCase().includes(searchLower) ||
        conversation.lastMessage.toLowerCase().includes(searchLower))
    );
  });

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    handleSelectConversation,
  };
};
