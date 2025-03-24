
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

interface GroupData {
  name: string;
  description?: string;
  is_public: boolean;
  organization_id: string | null;
}

export const useGroupManagement = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, userRole, userProfile } = useUserRole();
  
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      // If not an admin, don't fetch anything
      if (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin') {
        setGroups([]);
        return;
      }
      
      let query = supabase.from('conversations')
        .select('*')
        .is('user1_id', null)
        .is('user2_id', null)
        .not('name', 'is', null);
      
      // If org admin, only show groups for their organization
      if (!isAdmin && userRole === 'org_admin' && userProfile?.organization_id) {
        query = query.eq('organization_id', userProfile.organization_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createGroup = async (groupData: GroupData) => {
    // Check admin permissions
    if (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin') {
      throw new Error("Permission denied: Only administrators can create groups");
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        name: groupData.name,
        description: groupData.description,
        is_public: groupData.is_public,
        organization_id: groupData.organization_id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Refresh the group list
    await fetchGroups();
    return data;
  };
  
  const updateGroup = async (groupId: string, groupData: Partial<GroupData>) => {
    // Check admin permissions
    if (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin') {
      throw new Error("Permission denied: Only administrators can update groups");
    }
    
    // For org admins, ensure they can only modify groups in their organization
    if (!isAdmin && userRole === 'org_admin' && userProfile?.organization_id) {
      const { data, error } = await supabase
        .from('conversations')
        .select('organization_id')
        .eq('id', groupId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data.organization_id !== userProfile.organization_id) {
        throw new Error("Permission denied: You can only update groups in your organization");
      }
    }
    
    const { error } = await supabase
      .from('conversations')
      .update({
        name: groupData.name,
        description: groupData.description,
        is_public: groupData.is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', groupId);
    
    if (error) {
      throw error;
    }
    
    // Refresh the group list
    await fetchGroups();
  };
  
  const deleteGroup = async (groupId: string) => {
    // Check admin permissions
    if (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin') {
      throw new Error("Permission denied: Only administrators can delete groups");
    }
    
    // For org admins, ensure they can only delete groups in their organization
    if (!isAdmin && userRole === 'org_admin' && userProfile?.organization_id) {
      const { data, error } = await supabase
        .from('conversations')
        .select('organization_id')
        .eq('id', groupId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data.organization_id !== userProfile.organization_id) {
        throw new Error("Permission denied: You can only delete groups in your organization");
      }
    }
    
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', groupId);
    
    if (error) {
      throw error;
    }
    
    // Refresh the group list
    await fetchGroups();
  };
  
  // Load groups on initial render
  useEffect(() => {
    fetchGroups();
  }, [isAdmin, userRole, userProfile?.organization_id]);
  
  return {
    groups,
    isLoading,
    createGroup,
    updateGroup,
    deleteGroup,
    refreshGroups: fetchGroups
  };
};
