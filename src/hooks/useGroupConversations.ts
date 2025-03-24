
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation, Group, GroupConversation, GroupMember } from "../types/chat";
import { toast } from "sonner";

// Define types for group data
interface GroupData {
  id: string;
  name: string;
  description: string | null;
  is_group: boolean;
  is_public: boolean;
  is_business: boolean;
  unique_group_id: string | null;
  organization_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  // Add any other properties as needed
}

// Define types for group members data
interface GroupMemberData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  // Add any other properties as needed
}

export const useGroupConversations = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [groupMembers, setGroupMembers] = useState<{[groupId: string]: GroupMemberData[]}>({});
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup && selectedGroup.id) {
      fetchGroupMembers(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.info("Fetching groups for user:", user.id);
        
        let fetchedGroups: GroupData[] = [];
        
        try {
          // Try to fetch real groups from the database
          const { data, error } = await supabase
            .from('groups')
            .select('*');
            
          if (error) {
            throw error;
          }
          
          fetchedGroups = data as GroupData[];
          console.log("Fetched groups:", fetchedGroups);
        } catch (error) {
          console.error("Error fetching groups:", error);
          // Fallback to demo data
          fetchedGroups = [
            {
              id: '1',
              name: 'Marketing Team',
              description: 'Group for marketing team discussions',
              is_group: true,
              is_public: true,
              is_business: true,
              unique_group_id: 'marketing-123',
              organization_id: 'org-123',
              created_by: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              member_count: 5
            },
            {
              id: '2',
              name: 'HR Department',
              description: 'Group for HR discussions',
              is_group: true,
              is_public: false,
              is_business: true,
              unique_group_id: 'hr-123',
              organization_id: 'org-123',
              created_by: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              member_count: 3
            },
            {
              id: '3',
              name: 'Project Alpha',
              description: 'Collaboration for Project Alpha',
              is_group: true,
              is_public: true,
              is_business: true,
              unique_group_id: 'alpha-123',
              organization_id: 'org-123',
              created_by: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              member_count: 8
            }
          ];
        }

        setGroups(fetchedGroups);
        
        // If we have groups, select the first one by default
        if (fetchedGroups.length > 0 && !selectedGroup) {
          setSelectedGroup(fetchedGroups[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      // Try to fetch real group members from the database
      let fetchedMembers: GroupMemberData[] = [];
      
      try {
        const { data, error } = await supabase
          .from('group_members')
          .select('profiles(id, first_name, last_name, avatar_url)')
          .eq('group_id', groupId);
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match the expected format
        if (data && Array.isArray(data)) {
          fetchedMembers = data.map(item => {
            const profile = item.profiles as unknown as GroupMemberData;
            return {
              id: profile?.id || '',
              first_name: profile?.first_name || '',
              last_name: profile?.last_name || '',
              avatar_url: profile?.avatar_url || null
            };
          });
        }
      } catch (error) {
        console.error("Error fetching group members:", error);
        // Fallback to demo data
        fetchedMembers = [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            avatar_url: null
          },
          {
            id: '2',
            first_name: 'Jane',
            last_name: 'Smith',
            avatar_url: null
          },
          {
            id: '3',
            first_name: 'Robert',
            last_name: 'Johnson',
            avatar_url: null
          }
        ];
      }
      
      setGroupMembers(prev => ({
        ...prev,
        [groupId]: fetchedMembers
      }));
    } catch (error) {
      console.error("Error fetching group members:", error);
      toast.error("Failed to load group members");
    }
  };

  const createGroup = async (groupData: Partial<GroupData>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }
      
      const newGroup = {
        ...groupData,
        is_group: true,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('groups')
        .insert(newGroup)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating group:", error);
        toast.error("Failed to create group");
        return null;
      }
      
      // Add current user as a member of the group
      await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'admin'
        });
      
      toast.success("Group created successfully");
      
      // Refresh groups list
      fetchGroups();
      
      return data;
    } catch (error) {
      console.error("Error in createGroup:", error);
      toast.error("Failed to create group");
      return null;
    }
  };

  const updateGroup = async (groupId: string, updateData: Partial<GroupData>) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .update(updateData)
        .eq('id', groupId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating group:", error);
        toast.error("Failed to update group");
        return false;
      }
      
      toast.success("Group updated successfully");
      
      // Update the local state
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId ? { ...group, ...updateData } : group
        )
      );
      
      // Update selectedGroup if it's the one that was updated
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(prev => ({ ...prev, ...updateData } as GroupData));
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateGroup:", error);
      toast.error("Failed to update group");
      return false;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      // First, delete all group members
      const { error: membersError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);
        
      if (membersError) {
        console.error("Error deleting group members:", membersError);
      }
      
      // Then delete the group
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);
        
      if (error) {
        console.error("Error deleting group:", error);
        toast.error("Failed to delete group");
        return false;
      }
      
      toast.success("Group deleted successfully");
      
      // Update the local state
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      
      // Clear selectedGroup if it's the one that was deleted
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(null);
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteGroup:", error);
      toast.error("Failed to delete group");
      return false;
    }
  };

  const addMemberToGroup = async (groupId: string, userId: string, role: 'admin' | 'member' = 'member') => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          role
        })
        .select();
        
      if (error) {
        console.error("Error adding member to group:", error);
        toast.error("Failed to add member to group");
        return false;
      }
      
      toast.success("Member added to group");
      
      // Refresh group members
      fetchGroupMembers(groupId);
      
      return true;
    } catch (error) {
      console.error("Error in addMemberToGroup:", error);
      toast.error("Failed to add member to group");
      return false;
    }
  };

  const removeMemberFromGroup = async (groupId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error removing member from group:", error);
        toast.error("Failed to remove member from group");
        return false;
      }
      
      toast.success("Member removed from group");
      
      // Refresh group members
      fetchGroupMembers(groupId);
      
      return true;
    } catch (error) {
      console.error("Error in removeMemberFromGroup:", error);
      toast.error("Failed to remove member from group");
      return false;
    }
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    groups,
    filteredGroups,
    selectedGroup,
    setSelectedGroup,
    groupMembers,
    searchQuery,
    setSearchQuery,
    isLoading,
    createGroup,
    updateGroup,
    deleteGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    refreshGroups: fetchGroups
  };
};
