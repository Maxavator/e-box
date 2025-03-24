
import { useAdminStatus } from "./useAdminStatus";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Group } from "../types";
import { Session } from "@supabase/supabase-js";

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  }[];
}

export const useGroupManagement = () => {
  const { isAdmin, session } = useAdminStatus();
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get organization id from user profile
  const organizationId = session?.user?.user_metadata?.organization_id;

  // Fetch all groups for the organization
  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("organization_id", organizationId);

      if (error) throw error;

      return data as Group[];
    },
    enabled: !!organizationId && isAdmin,
  });

  // Fetch all group members
  const {
    data: members = [],
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ["group_members", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("group_members")
        .select(
          "*, profiles:user_id(id, first_name, last_name, avatar_url)"
        )
        .eq("organizations.id", organizationId);

      if (error) throw error;

      return data as GroupMember[];
    },
    enabled: !!organizationId && isAdmin,
  });

  // Create a new group
  const createGroupMutation = useMutation({
    mutationFn: async (newGroup: Omit<Group, "id" | "member_count" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("groups")
        .insert({
          name: newGroup.name,
          description: newGroup.description,
          is_public: newGroup.is_public,
          organization_id: newGroup.organization_id,
          created_by: newGroup.created_by,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created successfully");
      setIsCreatingGroup(false);
    },
    onError: (error) => {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    },
  });

  // Update an existing group
  const updateGroupMutation = useMutation({
    mutationFn: async (updatedGroup: Partial<Group> & { id: string }) => {
      const { data, error } = await supabase
        .from("groups")
        .update({
          name: updatedGroup.name,
          description: updatedGroup.description,
          is_public: updatedGroup.is_public,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedGroup.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group updated successfully");
      setIsEditingGroup(null);
    },
    onError: (error) => {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    },
  });

  // Delete a group
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);

      if (error) throw error;
      return groupId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    },
  });

  // Handler functions
  const handleCreateGroup = (newGroup: Omit<Group, "id" | "member_count" | "created_at" | "updated_at">) => {
    return createGroupMutation.mutateAsync(newGroup);
  };

  const handleUpdateGroup = (updatedGroup: Partial<Group> & { id: string }) => {
    return updateGroupMutation.mutateAsync(updatedGroup);
  };

  const handleDeleteGroup = (groupId: string) => {
    return deleteGroupMutation.mutateAsync(groupId);
  };

  return {
    isAdmin,
    session,
    groups,
    members,
    isLoadingGroups,
    isLoadingMembers,
    isCreatingGroup,
    setIsCreatingGroup,
    isEditingGroup,
    setIsEditingGroup,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup
  };
};
