
import { useState } from 'react';
import { Group } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminStatus } from './useAdminStatus';
import { useAuthSession } from './useAuthSession';

export function useGroupManagement() {
  const authStatus = useAdminStatus();
  const { isAdmin, userRole, isLoading, error } = authStatus;
  const { session } = useAuthSession();
  
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch groups
  const { 
    data: groups = [], 
    isLoading: isLoadingGroups 
  } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Group[];
    },
  });
  
  // Fetch group members
  const { 
    data: members = [],
    isLoading: isLoadingMembers
  } = useQuery({
    queryKey: ['groupMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          group_id,
          role,
          profiles:user_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });
  
  // Create group mutation
  const createMutation = useMutation({
    mutationFn: async (newGroup: Omit<Group, 'id' | 'memberCount'>) => {
      const { data, error } = await supabase
        .from('groups')
        .insert(newGroup)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create group: ${error.message}`);
    }
  });
  
  // Update group mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedGroup: Partial<Group> & { id: string }) => {
      const { id, ...rest } = updatedGroup;
      const { data, error } = await supabase
        .from('groups')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update group: ${error.message}`);
    }
  });
  
  // Delete group mutation
  const deleteMutation = useMutation({
    mutationFn: async (groupId: string) => {
      setIsDeleting(true);
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);
      
      if (error) throw error;
      return groupId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsDeleting(false);
    },
    onError: (error: any) => {
      setIsDeleting(false);
      toast.error(`Failed to delete group: ${error.message}`);
    }
  });
  
  const createGroup = async (newGroup: Omit<Group, 'id' | 'memberCount'>) => {
    return createMutation.mutateAsync(newGroup);
  };
  
  const updateGroup = async (updatedGroup: Partial<Group> & { id: string }) => {
    return updateMutation.mutateAsync(updatedGroup);
  };
  
  const deleteGroup = async (groupId: string) => {
    return deleteMutation.mutateAsync(groupId);
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
    isDeleting
  };
}
