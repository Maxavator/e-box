
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Conversation, Message } from "@/types/chat";

interface ContactSearchParams {
  searchTerm: string;
  searchType: 'name' | 'mobile' | 'id';
}

interface DirectMessageParams {
  receiverId: string;
  message: string;
}

export const useDirectMessaging = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch user's conversations
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      // Fetch direct (1:1) conversations
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          last_message:messages(
            content,
            created_at,
            sender_id
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .is('is_group', false)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
        setIsLoading(false);
        return;
      }
      
      // Get profiles for the conversation participants
      const conversationsWithProfiles = await Promise.all(data.map(async (conv) => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', otherUserId)
          .maybeSingle();
        
        // Check for unread messages
        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('sender_id', otherUserId)
          .gt('created_at', conv.last_read_at || '1970-01-01');
        
        if (countError) {
          console.error("Error counting unread messages:", countError);
        }
        
        // Format conversation
        const lastMessageObj = conv.last_message ? conv.last_message[0] : null;
        
        return {
          id: conv.id,
          name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown User',
          avatar: profile?.avatar_url,
          participantIds: [conv.user1_id, conv.user2_id],
          lastMessage: lastMessageObj ? {
            content: lastMessageObj.content,
            timestamp: lastMessageObj.created_at,
            senderId: lastMessageObj.sender_id
          } : undefined,
          unreadCount: count || 0,
          createdAt: conv.created_at,
          updatedAt: conv.updated_at
        } as Conversation;
      }));
      
      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error("Error in fetchConversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch pending invitations
  const fetchInvitations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Fetch invitations (pending conversations)
      const { data, error } = await supabase
        .from('conversation_invitations')
        .select(`
          *,
          sender:sender_id (
            id, 
            first_name, 
            last_name, 
            avatar_url
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
      
      if (error) {
        console.error("Error fetching invitations:", error);
        return;
      }
      
      setInvitations(data || []);
    } catch (error) {
      console.error("Error in fetchInvitations:", error);
    }
  };
  
  // Search for users by name, mobile number, or ID
  const searchUsers = async (params: ContactSearchParams) => {
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to search for contacts");
        setIsSearching(false);
        return;
      }
      
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url');
      
      // Don't include the current user in results
      query = query.neq('id', user.id);
      
      // Apply search filters based on search type
      if (params.searchType === 'name') {
        // Split the name for more flexible searching
        const nameParts = params.searchTerm.split(' ');
        
        if (nameParts.length > 1) {
          // If there are multiple parts, search first and last name
          query = query.or(
            `first_name.ilike.%${nameParts[0]}%,last_name.ilike.%${nameParts[1]}%`
          );
        } else {
          // If there's only one part, search both first and last name
          query = query.or(
            `first_name.ilike.%${params.searchTerm}%,last_name.ilike.%${params.searchTerm}%`
          );
        }
      } else if (params.searchType === 'mobile') {
        // Assuming there's a mobile_phone_number column in profiles
        query = query.ilike('mobile_phone_number', `%${params.searchTerm}%`);
      } else if (params.searchType === 'id') {
        // For SA ID searches (this might be in a different table/column)
        // This is a placeholder and would need to be adjusted based on your schema
        query = query.ilike('id_number', `%${params.searchTerm}%`);
      }
      
      const { data, error } = await query.limit(10);
      
      if (error) {
        console.error("Error searching users:", error);
        toast.error("Failed to search for users");
        setIsSearching(false);
        return;
      }
      
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error in searchUsers:", error);
      toast.error("Failed to search for users");
    } finally {
      setIsSearching(false);
    }
  };
  
  // Send a direct message invitation to another user
  const sendMessageInvitation = async (userId: string, initialMessage?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to send messages");
        return null;
      }
      
      // Check if a conversation already exists
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${user.id})`)
        .maybeSingle();
      
      if (convError) {
        console.error("Error checking existing conversations:", convError);
        toast.error("Failed to check for existing conversations");
        return null;
      }
      
      // If conversation exists, just return it
      if (existingConv) {
        toast.info("You already have a conversation with this user");
        return existingConv;
      }
      
      // Create an invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('conversation_invitations')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          initial_message: initialMessage,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (inviteError) {
        console.error("Error creating invitation:", inviteError);
        toast.error("Failed to send message invitation");
        return null;
      }
      
      toast.success("Message invitation sent");
      return invitation;
    } catch (error) {
      console.error("Error in sendMessageInvitation:", error);
      toast.error("Failed to send message invitation");
      return null;
    }
  };
  
  // Respond to a message invitation (accept or decline)
  const respondToInvitation = async (invitationId: string, accept: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to respond to invitations");
        return null;
      }
      
      // Get the invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('conversation_invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('receiver_id', user.id)
        .single();
      
      if (inviteError) {
        console.error("Error fetching invitation:", inviteError);
        toast.error("Failed to find the invitation");
        return null;
      }
      
      // Update invitation status
      const { error: updateError } = await supabase
        .from('conversation_invitations')
        .update({
          status: accept ? 'accepted' : 'declined',
          responded_at: new Date().toISOString()
        })
        .eq('id', invitationId);
      
      if (updateError) {
        console.error("Error updating invitation:", updateError);
        toast.error(`Failed to ${accept ? 'accept' : 'decline'} the invitation`);
        return null;
      }
      
      if (accept) {
        // Create a conversation
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .insert({
            user1_id: invitation.sender_id,
            user2_id: invitation.receiver_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (convError) {
          console.error("Error creating conversation:", convError);
          toast.error("Failed to create conversation");
          return null;
        }
        
        // If there was an initial message, add it
        if (invitation.initial_message) {
          const { error: msgError } = await supabase
            .from('messages')
            .insert({
              conversation_id: conversation.id,
              sender_id: invitation.sender_id,
              content: invitation.initial_message,
              created_at: new Date().toISOString()
            });
          
          if (msgError) {
            console.error("Error adding initial message:", msgError);
          }
        }
        
        toast.success("Invitation accepted");
        fetchConversations();
        return conversation;
      } else {
        toast.success("Invitation declined");
        return null;
      }
    } catch (error) {
      console.error("Error in respondToInvitation:", error);
      toast.error("Failed to process invitation response");
      return null;
    } finally {
      fetchInvitations();
    }
  };
  
  // Send a direct message to an existing conversation
  const sendDirectMessage = async (params: DirectMessageParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to send messages");
        return null;
      }
      
      // Find or create conversation
      let conversationId: string;
      
      // Check if conversation exists
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${params.receiverId}),and(user1_id.eq.${params.receiverId},user2_id.eq.${user.id})`)
        .maybeSingle();
      
      if (convError) {
        console.error("Error checking existing conversations:", convError);
        toast.error("Failed to check for existing conversations");
        return null;
      }
      
      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        // Create new conversation
        const { data: newConv, error: newConvError } = await supabase
          .from('conversations')
          .insert({
            user1_id: user.id,
            user2_id: params.receiverId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (newConvError) {
          console.error("Error creating conversation:", newConvError);
          toast.error("Failed to create conversation");
          return null;
        }
        
        conversationId = newConv.id;
      }
      
      // Send the message
      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: params.message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (msgError) {
        console.error("Error sending message:", msgError);
        toast.error("Failed to send message");
        return null;
      }
      
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      fetchConversations();
      return message;
    } catch (error) {
      console.error("Error in sendDirectMessage:", error);
      toast.error("Failed to send message");
      return null;
    }
  };
  
  // Forward a message to another conversation
  const forwardMessage = async (messageId: string, targetConversationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to forward messages");
        return null;
      }
      
      // Get the original message
      const { data: originalMessage, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();
      
      if (msgError) {
        console.error("Error fetching original message:", msgError);
        toast.error("Failed to fetch message to forward");
        return null;
      }
      
      // Check if the message can be forwarded using our function
      const { data: canForward, error: forwardError } = await supabase
        .rpc('can_forward_message', { message_id: messageId });
      
      if (forwardError) {
        console.error("Error checking forward permissions:", forwardError);
        toast.error("Failed to check forwarding permissions");
        return null;
      }
      
      if (!canForward) {
        toast.error("This message cannot be forwarded due to organizational policies");
        return null;
      }
      
      // Create the forwarded message
      const { data: forwardedMessage, error: fwdError } = await supabase
        .from('messages')
        .insert({
          conversation_id: targetConversationId,
          sender_id: user.id,
          content: originalMessage.content,
          is_forwarded: true,
          original_message_id: messageId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (fwdError) {
        console.error("Error forwarding message:", fwdError);
        toast.error("Failed to forward message");
        return null;
      }
      
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', targetConversationId);
      
      toast.success("Message forwarded successfully");
      return forwardedMessage;
    } catch (error) {
      console.error("Error in forwardMessage:", error);
      toast.error("Failed to forward message");
      return null;
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchConversations();
    fetchInvitations();
  }, []);
  
  return {
    contacts,
    conversations,
    invitations,
    isLoading,
    searchResults,
    isSearching,
    searchUsers,
    sendMessageInvitation,
    respondToInvitation,
    sendDirectMessage,
    forwardMessage,
    refreshConversations: fetchConversations,
    refreshInvitations: fetchInvitations
  };
};
