import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { demoConversations, getUserById } from "@/data/chat";
import { supabase } from "@/integrations/supabase/client";
import type { Message, Conversation } from "@/types/chat";

export const useChat = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [calendarView, setCalendarView] = useState<"calendar" | "inbox">("calendar");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState(demoConversations);
  const [selectedFeature, setSelectedFeature] = useState("");

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

      const transformedConvos = await Promise.all(convos.map(async (conv) => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', otherUserId)
          .single();

        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';
        
        return {
          id: conv.id,
          userId: otherUserId,
          unreadCount: 0,
          messages: messages?.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            text: msg.content,
            timestamp: msg.created_at,
            status: 'sent',
            reactions: [],
            sender: msg.sender_id === user.id ? 'me' : 'them'
          })) || [],
          lastMessage
        };
      }));

      setConversations(transformedConvos);
    };

    fetchConversations();
  }, []);

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
        async (payload) => {
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
  }, [selectedConversation?.id, toast]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: messageData, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        content: newMessage,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return;
    }

    setNewMessage("");

    setSelectedConversation(prev => {
      if (!prev) return prev;
      const newMessageObj: Message = {
        id: messageData.id,
        senderId: user.id,
        text: newMessage,
        timestamp: messageData.created_at,
        status: 'sent',
        reactions: [],
        sender: 'me'
      };

      return {
        ...prev,
        messages: [...prev.messages, newMessageObj],
        lastMessage: newMessage
      };
    });
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m =>
          m.id === messageId
            ? { ...m, text: newContent, edited: true }
            : m
        ),
      };
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      const updatedMessages = prev.messages.filter(m => m.id !== messageId);
      return {
        ...prev,
        messages: updatedMessages,
        lastMessage: updatedMessages[updatedMessages.length - 1]?.text ?? ''
      };
    });
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setSelectedConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== messageId) return m;

          const reactions = [...m.reactions];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            if (existingReaction.users.includes('me')) {
              return {
                ...m,
                reactions: reactions
                  .map(r => r.emoji === emoji ? { ...r, users: r.users.filter(u => u !== 'me') } : r)
                  .filter(r => r.users.length > 0)
              };
            } else {
              return {
                ...m,
                reactions: reactions.map(r => 
                  r.emoji === emoji ? { ...r, users: [...r.users, 'me'] } : r
                )
              };
            }
          } else {
            return {
              ...m,
              reactions: [...reactions, { emoji, users: ['me'] }]
            };
          }
        })
      };
    });
  };

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
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    calendarView,
    setCalendarView,
    selectedConversation,
    newMessage,
    setNewMessage,
    selectedFeature,
    setSelectedFeature,
    filteredConversations,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
  };
};
