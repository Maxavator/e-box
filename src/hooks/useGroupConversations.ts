import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Conversation } from "@/types/chat";

interface GroupCreateParams {
  name: string;
  description?: string;
  isPublic: boolean;
  organizationId?: string | null;
}

interface GroupMemberParams {
  userId: string;
  role?: "moderator" | "member";
}

export const useGroupConversations = () => {
  const [groups, setGroups] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Conversation | null>(null);
  const { isAdmin, userRole, userProfile } = useUserRole();
  
  // Fetch all accessible groups for the current user
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to view groups");
        setIsLoading(false);
        return;
      }
      
      // Fetch groups where user is a member
      const { data: memberGroups, error: memberError } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          role,
          status,
          conversations:conversation_id (
            id,
            name,
            description,
            is_public,
            is_group,
            is_business,
            unique_group_id,
            organization_id,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');
      
      if (memberError) {
        console.error("Error fetching member groups:", memberError);
        toast.error("Failed to load groups");
        setIsLoading(false);
        return;
      }
      
      // Fetch public groups if any
      const { data: publicGroups, error: publicError } = await supabase
        .from('conversations')
        .select('*')
        .eq('is_group', true)
        .eq('is_public', true);
      
      if (publicError) {
        console.error("Error fetching public groups:", publicError);
      }
      
      // Transform the data into Conversation type
      const memberConversations = memberGroups
        ?.filter(g => g.conversations)
        .map(g => ({
          id: g.conversations?.id,
          name: g.conversations?.name,
          description: g.conversations?.description,
          isGroup: g.conversations?.is_group,
          isPublic: g.conversations?.is_public,
          isBusiness: g.conversations?.is_business,
          uniqueGroupId: g.conversations?.unique_group_id,
          organizationId: g.conversations?.organization_id,
          createdBy: g.conversations?.created_by,
          createdAt: g.conversations?.created_at,
          updatedAt: g.conversations?.updated_at,
          userRole: g.role,
          participantIds: [],
          unreadCount: 0
        } as Conversation));
      
      const publicConversations = publicGroups
        ?.filter(g => !memberConversations?.some(m => m.id === g.id))
        .map(g => ({
          id: g.id,
          name: g.name,
          description: g.description,
          isGroup: g.is_group,
          isPublic: g.is_public,
          isBusiness: g.is_business,
          uniqueGroupId: g.unique_group_id,
          organizationId: g.organization_id,
          createdBy: g.created_by,
          createdAt: g.created_at,
          updatedAt: g.updated_at,
          participantIds: [],
          unreadCount: 0
        } as Conversation));
      
      // Combine and set all groups
      const allGroups = [
        ...(memberConversations || []),
        ...(publicConversations || [])
      ];
      
      setGroups(allGroups);
    } catch (error) {
      console.error("Error in fetchGroups:", error);
      toast.error("Failed to load group conversations");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new group
  const createGroup = async (params: GroupCreateParams, initialMembers?: GroupMemberParams[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create groups");
        return null;
      }
      
      // Create the group conversation
      const { data: group, error: groupError } = await supabase
        .from('conversations')
        .insert({
          name: params.name,
          description: params.description,
          is_public: params.isPublic,
          is_group: true,
          is_business: params.organizationId ? true : false,
          organization_id: params.organizationId,
          created_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (groupError) {
        console.error("Error creating group:", groupError);
        toast.error("Failed to create group");
        return null;
      }
      
      // Add creator as a moderator member
      const { error: memberError } = await supabase
        .from('conversation_members')
        .insert({
          conversation_id: group.id,
          user_id: user.id,
          role: 'moderator',
          status: 'accepted',
          join_date: new Date().toISOString()
        });
      
      if (memberError) {
        console.error("Error adding creator as member:", memberError);
        toast.error("Failed to set up group membership");
        return group;
      }
      
      // Add any initial members if provided
      if (initialMembers && initialMembers.length > 0) {
        const memberInserts = initialMembers.map(member => ({
          conversation_id: group.id,
          user_id: member.userId,
          role: member.role || 'member',
          status: 'pending',
          invited_by: user.id
        }));
        
        const { error: batchMemberError } = await supabase
          .from('conversation_members')
          .insert(memberInserts);
        
        if (batchMemberError) {
          console.error("Error adding initial members:", batchMemberError);
          toast.error("Failed to invite initial members");
        }
      }
      
      // Refresh the groups list
      fetchGroups();
      
      return group;
    } catch (error) {
      console.error("Error in createGroup:", error);
      toast.error("Failed to create group");
      return null;
    }
  };
  
  // Join a group (request to join or accept invitation)
  const joinGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to join groups");
        return false;
      }
      
      // Check if user already has a membership record
      const { data: existingMembership, error: checkError } = await supabase
        .from('conversation_members')
        .select('*')
        .eq('conversation_id', groupId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking membership:", checkError);
        toast.error("Failed to check group membership");
        return false;
      }
      
      if (existingMembership) {
        // If pending invitation, accept it
        if (existingMembership.status === 'pending' && existingMembership.invited_by) {
          const { error: updateError } = await supabase
            .from('conversation_members')
            .update({
              status: 'accepted',
              join_date: new Date().toISOString()
            })
            .eq('id', existingMembership.id);
          
          if (updateError) {
            console.error("Error accepting invitation:", updateError);
            toast.error("Failed to accept group invitation");
            return false;
          }
          
          toast.success("You have joined the group");
          fetchGroups();
          return true;
        }
        
        toast.info("You are already a member of this group");
        return true;
      }
      
      // Get group info to check if it's public
      const { data: group, error: groupError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (groupError) {
        console.error("Error fetching group:", groupError);
        toast.error("Failed to fetch group information");
        return false;
      }
      
      // If group is public, join directly as an accepted member
      // If private, add as pending member (request to join)
      const { error: joinError } = await supabase
        .from('conversation_members')
        .insert({
          conversation_id: groupId,
          user_id: user.id,
          role: 'member',
          status: group.is_public ? 'accepted' : 'pending',
          join_date: group.is_public ? new Date().toISOString() : null
        });
      
      if (joinError) {
        console.error("Error joining group:", joinError);
        toast.error("Failed to join group");
        return false;
      }
      
      if (group.is_public) {
        toast.success("You have joined the group");
      } else {
        toast.success("Your request to join has been sent to the group moderators");
      }
      
      fetchGroups();
      return true;
    } catch (error) {
      console.error("Error in joinGroup:", error);
      toast.error("Failed to join group");
      return false;
    }
  };
  
  // Invite a user to a group
  const inviteToGroup = async (groupId: string, userIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to invite users");
        return false;
      }
      
      // Check if current user is a moderator
      const { data: membership, error: membershipError } = await supabase
        .from('conversation_members')
        .select('*')
        .eq('conversation_id', groupId)
        .eq('user_id', user.id)
        .eq('role', 'moderator')
        .maybeSingle();
      
      if (membershipError || !membership) {
        console.error("Error checking moderator status:", membershipError);
        toast.error("Only group moderators can invite users");
        return false;
      }
      
      // Prepare invitation records
      const invitations = userIds.map(userId => ({
        conversation_id: groupId,
        user_id: userId,
        role: 'member',
        status: 'pending',
        invited_by: user.id
      }));
      
      // Insert invitations
      const { error: inviteError } = await supabase
        .from('conversation_members')
        .insert(invitations);
      
      if (inviteError) {
        console.error("Error inviting users:", inviteError);
        toast.error("Failed to invite users to the group");
        return false;
      }
      
      toast.success(`Invited ${userIds.length} user(s) to the group`);
      return true;
    } catch (error) {
      console.error("Error in inviteToGroup:", error);
      toast.error("Failed to invite users to the group");
      return false;
    }
  };
  
  // Approve or reject a join request
  const respondToJoinRequest = async (membershipId: string, approve: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to manage join requests");
        return false;
      }
      
      // Get the membership record
      const { data: membership, error: membershipError } = await supabase
        .from('conversation_members')
        .select('conversation_id, user_id')
        .eq('id', membershipId)
        .single();
      
      if (membershipError) {
        console.error("Error fetching membership:", membershipError);
        toast.error("Failed to fetch join request");
        return false;
      }
      
      // Check if current user is a moderator of this group
      const { data: moderator, error: moderatorError } = await supabase
        .from('conversation_members')
        .select('*')
        .eq('conversation_id', membership.conversation_id)
        .eq('user_id', user.id)
        .eq('role', 'moderator')
        .maybeSingle();
      
      if (moderatorError || !moderator) {
        console.error("Error checking moderator status:", moderatorError);
        toast.error("Only group moderators can approve join requests");
        return false;
      }
      
      if (approve) {
        // Approve the request
        const { error: updateError } = await supabase
          .from('conversation_members')
          .update({
            status: 'accepted',
            join_date: new Date().toISOString()
          })
          .eq('id', membershipId);
        
        if (updateError) {
          console.error("Error approving request:", updateError);
          toast.error("Failed to approve join request");
          return false;
        }
        
        toast.success("Join request approved");
      } else {
        // Reject the request by deleting the record
        const { error: deleteError } = await supabase
          .from('conversation_members')
          .delete()
          .eq('id', membershipId);
        
        if (deleteError) {
          console.error("Error rejecting request:", deleteError);
          toast.error("Failed to reject join request");
          return false;
        }
        
        toast.success("Join request rejected");
      }
      
      return true;
    } catch (error) {
      console.error("Error in respondToJoinRequest:", error);
      toast.error("Failed to process join request");
      return false;
    }
  };
  
  // Leave a group
  const leaveGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to leave a group");
        return false;
      }
      
      // Delete the membership record
      const { error } = await supabase
        .from('conversation_members')
        .delete()
        .eq('conversation_id', groupId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error leaving group:", error);
        toast.error("Failed to leave group");
        return false;
      }
      
      toast.success("You have left the group");
      fetchGroups();
      
      return true;
    } catch (error) {
      console.error("Error in leaveGroup:", error);
      toast.error("Failed to leave group");
      return false;
    }
  };
  
  // Fetch group details including members
  const fetchGroupDetails = async (groupId: string) => {
    try {
      setIsLoading(true);
      
      // Get group information
      const { data: group, error: groupError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (groupError) {
        console.error("Error fetching group details:", groupError);
        toast.error("Failed to load group details");
        setIsLoading(false);
        return null;
      }
      
      // Get members information
      const { data: members, error: membersError } = await supabase
        .from('conversation_members')
        .select(`
          id,
          role,
          status,
          invitation_date,
          join_date,
          invited_by,
          user:user_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('conversation_id', groupId);
      
      if (membersError) {
        console.error("Error fetching group members:", membersError);
        toast.error("Failed to load group members");
        setIsLoading(false);
        return null;
      }
      
      // Convert to Conversation type with members
      const conversation: Conversation = {
        id: group.id,
        name: group.name,
        description: group.description,
        isGroup: group.is_group,
        isPublic: group.is_public,
        isBusiness: group.is_business,
        uniqueGroupId: group.unique_group_id,
        organizationId: group.organization_id,
        createdBy: group.created_by,
        createdAt: group.created_at,
        updatedAt: group.updated_at,
        participantIds: members?.map(m => m.user?.id) || [],
        members: members || [],
        unreadCount: 0
      };
      
      setSelectedGroup(conversation);
      setIsLoading(false);
      return conversation;
    } catch (error) {
      console.error("Error in fetchGroupDetails:", error);
      toast.error("Failed to load group details");
      setIsLoading(false);
      return null;
    }
  };
  
  // Find a group by its unique group ID
  const findGroupByUniqueId = async (uniqueId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('unique_group_id', uniqueId)
        .single();
      
      if (error) {
        console.error("Error finding group by unique ID:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in findGroupByUniqueId:", error);
      return null;
    }
  };
  
  // Load groups on initial render
  useEffect(() => {
    fetchGroups();
  }, []);
  
  return {
    groups,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    createGroup,
    joinGroup,
    inviteToGroup,
    respondToJoinRequest,
    leaveGroup,
    fetchGroupDetails,
    findGroupByUniqueId,
    refreshGroups: fetchGroups
  };
};
