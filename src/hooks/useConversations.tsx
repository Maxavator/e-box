
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation, Message } from "@/types/chat";
import { demoConversations } from "@/data/chat";
import { toast } from "sonner";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversation, setIsNewConversation] = useState(false);

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
          // Fetch conversations where the current user is either user1 or user2
          const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
            
          if (error) {
            throw error;
          }
          
          // Transform conversations data to match our Conversation type
          fetchedConversations = await Promise.all(data.map(async (conv) => {
            // Fetch messages for this conversation
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: true });
              
            if (messagesError) {
              console.error('Error fetching messages for conversation', conv.id, messagesError);
            }
            
            // Get other user details (if this is a one-on-one conversation)
            let otherUserId = user.id === conv.user1_id ? conv.user2_id : conv.user1_id;
            let conversationName = "Conversation";
            
            try {
              const { data: otherUser } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', otherUserId)
                .single();
                
              if (otherUser) {
                conversationName = `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || "User";
              }
            } catch (err) {
              console.error('Error fetching other user profile', err);
            }
            
            // Format messages to match our Message type
            const messages = messagesData ? messagesData.map(msg => ({
              id: msg.id,
              conversationId: msg.conversation_id,
              senderId: msg.sender_id,
              senderName: msg.sender_id === user.id ? 'You' : conversationName,
              content: msg.content,
              text: msg.content,
              timestamp: new Date(msg.created_at).toLocaleString(),
              status: 'delivered', // Default status
              reactions: {},
              sender: msg.sender_id === user.id ? 'me' : 'them'
            })) : [];
            
            // Create conversation object
            return {
              id: conv.id,
              name: conversationName,
              participantIds: [conv.user1_id, conv.user2_id],
              messages: messages,
              lastMessage: messages.length > 0 ? messages[messages.length - 1] : undefined
            } as Conversation;
          }));
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
          toast.error("Could not load your conversations");
        }

        setConversations(fetchedConversations);
        
        // If we have conversations, select the first one by default
        if (fetchedConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(fetchedConversations[0]);
          setIsNewConversation(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      
      // Check if this conversation has any messages
      const isNew = !conversation.messages || conversation.messages.length === 0;
      setIsNewConversation(isNew);
    }
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
    isNewConversation,
  };
};
