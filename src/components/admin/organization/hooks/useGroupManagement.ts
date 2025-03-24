import { useState } from 'react';
import { Group } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminStatus } from './useAdminStatus';

export function useGroupManagement() {
  const { isAdmin, userRole, isLoading, error, session } = useAdminStatus();
  
  // The userProfile property doesn't exist, so we'll remove it

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch groups
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (!session) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return data as Group[];
      } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
      }
    },
    enabled: !!session,
  });

  // Fetch members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      if (!session) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .order('first_name', { ascending: true });

        if (error) throw error;

        return data as any[];
      } catch (error) {
        console.error('Error fetching members:', error);
        return [];
      }
    },
    enabled: !!session,
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (newGroup: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'memberCount'>) => {
      if (!session) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await supabase
          .from('groups')
          .insert({
            ...newGroup,
            createdBy: session.user.id,
          })
          .select()
          .single();

        if (error) throw error;

        return data as Group;
      } catch (error) {
        console.error('Error creating group:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group created successfully');
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  });

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async (updatedGroup: Partial<Group> & { id: string }) => {
      if (!session) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await supabase
          .from('groups')
          .update(updatedGroup)
          .eq('id', updatedGroup.id)
          .select()
          .single();

        if (error) throw error;

        return data as Group;
      } catch (error) {
        console.error('Error updating group:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group updated successfully');
    },
    onError: (error) => {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
    }
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!session) {
        throw new Error('User not authenticated');
      }

      try {
        const { error } = await supabase
          .from('groups')
          .delete()
          .eq('id', groupId);

        if (error) throw error;

        return groupId;
      } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  });

  // Create a new group
  const createGroup = (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'memberCount'>) => {
    return createGroupMutation.mutateAsync(group);
  };

  // Update a group
  const updateGroup = (group: Partial<Group> & { id: string }) => {
    return updateGroupMutation.mutateAsync(group);
  };

  // Delete a group
  const deleteGroup = (groupId: string) => {
    return deleteGroupMutation.mutateAsync(groupId);
  };

  return {
    isAdmin,
    userRole,
    isLoading,
    error,
    session,
    groups,
    members,
    isLoadingGroups,
    isLoadingMembers,
    isCreatingGroup,
    setIsCreatingGroup,
    isEditingGroup,
    setIsEditingGroup,
    selectedGroup,
    setSelectedGroup,
    confirmDelete,
    setConfirmDelete,
    createGroup,
    updateGroup,
    deleteGroup,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending
  };
}
