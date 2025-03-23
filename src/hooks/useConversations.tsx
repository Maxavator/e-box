
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/chat";
import { Message } from "@/types/chat";
import { demoConversations } from "@/data/chat";

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
          // Try to fetch real conversations from the database
          const { data, error } = await supabase
            .from('conversations')
            .select('*');
            
          if (error) {
            throw error;
          }
          
          fetchedConversations = data as Conversation[];
        } catch (error) {
          console.error("Error fetching conversations:", error);
          // Fallback to demo data with proper UUID formatting
          fetchedConversations = demoConversations.map(conv => {
            // Generate a valid UUID for each demo conversation
            const validId = crypto.randomUUID();
            return {
              ...conv,
              id: validId,
              // Also update the conversationId in messages to match the new parent id
              messages: conv.messages ? conv.messages.map(msg => ({
                ...msg,
                conversationId: validId
              })) : undefined
            };
          });
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
