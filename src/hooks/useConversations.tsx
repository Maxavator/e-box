
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/types/chat";
import { getUserById } from "@/data/chat";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin, userRole } = useUserRole();
  const isAdminUser = isAdmin || userRole === 'org_admin' || userRole === 'global_admin';

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
          updated_at,
          is_admin_group
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
          // Check if this is an admin group conversation
          if (conv.is_admin_group && isAdminUser) {
            // Fetch messages for admin group
            const { data: messages, error: messagesError } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: true });

            if (messagesError) {
              console.error('Error fetching admin group messages:', messagesError);
              return null;
            }

            // Transform admin group messages
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
              userId: 'admin-group',
              unreadCount: 0,
              messages: transformedMessages,
              lastMessage: transformedMessages[transformedMessages.length - 1]?.text || '',
              isGroup: true,
              isAdminGroup: true,
              groupName: 'e-Box Admin Group'
            };
          }

          // Regular conversation processing
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
  }, [isAdminUser]);

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

    // If it's the admin group chat, redirect to the admin chat page
    if (conversation.isAdminGroup) {
      window.location.href = "/admin-chat";
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    // For admin group, always include in filter results but apply text filtering
    if (conversation.isAdminGroup) {
      return searchQuery === '' || 
             'admin group'.includes(searchQuery.toLowerCase()) ||
             conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    }

    // For regular conversations
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
