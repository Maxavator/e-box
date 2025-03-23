
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/shared/MainLayout";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useQuery } from "@tanstack/react-query";
import type { Conversation, Message } from "@/types/chat";

const AdminChat = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading: roleLoading } = useUserRole();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");

  // Check if user is an admin, if not redirect
  useEffect(() => {
    if (!roleLoading && !(isAdmin || userRole === 'org_admin' || userRole === 'global_admin')) {
      toast.error("You don't have access to Admin Group Chat");
      navigate("/dashboard");
    }
  }, [isAdmin, userRole, roleLoading, navigate]);

  // Get all admin users
  const { data: adminUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles:user_id(first_name, last_name, avatar_url)
        `)
        .in('role', ['global_admin', 'org_admin']);
      
      if (error) throw error;
      return users || [];
    },
    enabled: !!isAdmin || userRole === 'org_admin' || userRole === 'global_admin',
  });

  // Get or create admin group conversation
  const { data: adminConversation, isLoading: convLoading } = useQuery({
    queryKey: ['admin-group-conversation'],
    queryFn: async () => {
      // First check if admin group conversation exists
      const { data: existingConv, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('is_admin_group', true)
        .single();
      
      if (fetchError && fetchError.code !== 'PGSQL_ERROR_NO_ROWS') {
        throw fetchError;
      }
      
      if (existingConv) {
        // Fetch messages for this conversation
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            content,
            created_at,
            profiles:sender_id(first_name, last_name)
          `)
          .eq('conversation_id', existingConv.id)
          .order('created_at', { ascending: true });
        
        if (msgError) throw msgError;
        
        // Get current user
        const userResponse = await supabase.auth.getUser();
        const currentUserId = userResponse.data.user?.id;
        
        // Format messages
        const formattedMessages: Message[] = (messages || []).map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.content,
          timestamp: new Date(msg.created_at).toLocaleString(),
          status: 'sent',
          reactions: [],
          sender: msg.sender_id === currentUserId ? 'me' : 'them'
        }));
        
        setMessages(formattedMessages);
        
        return {
          id: existingConv.id,
          userId: 'admin-group',
          unreadCount: 0,
          messages: formattedMessages,
          lastMessage: formattedMessages.length > 0 ? formattedMessages[formattedMessages.length - 1].text : '',
          isGroup: true,
          groupName: 'e-Box Admin Group',
          isAdminGroup: true
        } as Conversation;
      }
      
      // Create admin group conversation if it doesn't exist
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user;
      if (!user) throw new Error('User not authenticated');
      
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          user1_id: user.id,
          user2_id: user.id, // Temporary, will be updated with proper group chat implementation
          is_admin_group: true,
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Return the newly created conversation
      return {
        id: newConv.id,
        userId: 'admin-group',
        unreadCount: 0,
        messages: [],
        lastMessage: '',
        isGroup: true,
        groupName: 'e-Box Admin Group',
        isAdminGroup: true
      } as Conversation;
    },
    enabled: !!isAdmin || userRole === 'org_admin' || userRole === 'global_admin',
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !adminConversation) return;
    
    const userResponse = await supabase.auth.getUser();
    const user = userResponse.data.user;
    if (!user) return;
    
    try {
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: adminConversation.id,
          sender_id: user.id,
          content: newMessage,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setNewMessage("");
      
      const newMessageObj: Message = {
        id: messageData.id,
        senderId: user.id,
        text: messageData.content,
        timestamp: new Date(messageData.created_at).toLocaleString(),
        status: 'sent',
        reactions: [],
        sender: 'me'
      };
      
      setMessages(prev => [...prev, newMessageObj]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    // Set up realtime subscription for messages
    if (!adminConversation) return;
    
    const channel = supabase
      .channel('admin_chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${adminConversation.id}`
        },
        async (payload) => {
          const userResponse = await supabase.auth.getUser();
          const user = userResponse.data.user;
          if (!user) return;
          
          const newMessage = payload.new;
          
          // Don't add our own messages (they were added manually)
          if (newMessage.sender_id === user.id) return;
          
          // Get sender info
          const { data: senderData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', newMessage.sender_id)
            .single();
          
          // Transform the message
          const messageObj: Message = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            text: newMessage.content,
            timestamp: new Date(newMessage.created_at).toLocaleString(),
            status: 'sent',
            reactions: [],
            sender: 'them'
          };
          
          setMessages(prev => [...prev, messageObj]);
          
          // Show notification for messages from others
          toast.info(`New admin message from ${senderData?.first_name || 'Admin'}`);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminConversation?.id]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  if (roleLoading || usersLoading || convLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  const conversationData: Conversation | null = adminConversation ? {
    ...adminConversation,
    messages: messages
  } : null;

  const mockConversations = adminConversation ? [adminConversation] : [];

  return (
    <ChatLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      conversations={mockConversations}
      selectedConversation={conversationData}
      onSelectConversation={() => {}}
      onCalendarActionClick={() => {}}
      newMessage={newMessage}
      onNewMessageChange={setNewMessage}
      onSendMessage={handleSendMessage}
      onEditMessage={() => {}}
      onDeleteMessage={() => {}}
      onReactToMessage={() => {}}
      calendarView="calendar"
      onLogout={handleLogout}
      onLogoClick={() => navigate("/dashboard")}
      isMobile={false}
      isAdminChat={true}
    />
  );
};

export default AdminChat;
