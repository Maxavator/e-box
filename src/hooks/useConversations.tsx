
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/types/chat";
import { getUserById } from "@/data/chat";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Fetching conversations for user:', user.id);

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

      console.log('Fetched conversations:', convos);

      // Transform conversations
      const transformedConvos: Conversation[] = await Promise.all(
        convos.map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          
          // Fetch messages for this conversation
          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            return null;
          }

          console.log(`Fetched ${messages?.length} messages for conversation:`, conv.id);

          // Transform messages
          const transformedMessages: Message[] = messages?.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            text: msg.content,
            timestamp: new Date(msg.created_at).toLocaleString(),
            status: 'sent',
            reactions: [],
            sender: msg.sender_id === user.id ? 'me' : 'them'
          })) || [];

          return {
            id: conv.id,
            userId: otherUserId,
            unreadCount: 0,
            messages: transformedMessages,
            lastMessage: transformedMessages[transformedMessages.length - 1]?.text || ''
          };
        })
      );

      const validConvos = transformedConvos.filter(Boolean) as Conversation[];
      console.log('Transformed conversations:', validConvos);
      setConversations(validConvos);
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = async (conversation: Conversation) => {
    console.log('Selecting conversation:', conversation.id);
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
