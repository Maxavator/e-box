
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/chat";
import { Message } from "@/types/chat";
import { conversations as mockConversations } from "@/data/chat";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.info("Fetching conversations for user:", user.id);
        
        let fetchedConversations;
        
        try {
          const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('is_public', true);
            
          if (error) {
            throw error;
          }
          
          fetchedConversations = data as Conversation[];
        } catch (error) {
          console.error("Error fetching conversations:", error);
          // Fallback to mock data
          fetchedConversations = mockConversations.filter(conv => !conv.isAdminGroup);
        }

        setConversations(fetchedConversations);
        
        // If we have conversations, select the first one by default
        if (fetchedConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(fetchedConversations[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    handleSelectConversation,
  };
};
