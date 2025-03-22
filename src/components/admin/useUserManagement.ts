
import { useState } from "react";
import { useUserRole } from "./hooks/useUserRole";
import { useOrganizations } from "./hooks/useOrganizations";
import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";
import type { UserWithRole, UserFormData } from "./types";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserManagement = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    role: "staff",
    organizationId: "",
  });

  const { isAdmin, userRole, isLoading: isRoleLoading, error: roleError } = useUserRole();
  const { organizations, userProfile, isLoading: isOrgsLoading, error: orgsError } = useOrganizations(isAdmin, userRole);
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers(isAdmin, userRole, userProfile);
  const { createUserMutation, updateUserMutation } = useUserMutations(isAdmin, userRole, userProfile);

  // Get platform statistics for global admins
  const { data: statistics, isLoading: isStatsLoading } = useQuery({
    queryKey: ['platformStatistics'],
    queryFn: async () => {
      if (!isAdmin || userRole !== 'global_admin') return null;
      
      try {
        // Count total users
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Count total organizations
        const { count: totalOrgs, error: orgsError } = await supabase
          .from('organizations')
          .select('*', { count: 'exact', head: true });
          
        if (orgsError) throw orgsError;
        
        // Count admin users
        const { count: totalAdmins, error: adminsError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .in('role', ['global_admin', 'org_admin']);
          
        if (adminsError) throw adminsError;
        
        // Get active users count (users active in the last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: activeUsers, error: activeUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_activity', sevenDaysAgo.toISOString());
          
        if (activeUsersError) throw activeUsersError;
        
        // Get organization metrics
        const { data: orgMetrics, error: orgMetricsError } = await supabase
          .from('organization_metrics')
          .select('*');
          
        if (orgMetricsError) throw orgMetricsError;
        
        // Get top users by activity
        const { data: topUsers, error: topUsersError } = await supabase
          .from('user_statistics')
          .select('user_id, action_count, profiles!inner(first_name, last_name)')
          .order('action_count', { ascending: false })
          .limit(5);
          
        if (topUsersError) throw topUsersError;
        
        return {
          totalUsers,
          totalOrgs,
          totalAdmins,
          activeUsers,
          orgMetrics,
          topUsers,
          activePercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        };
      } catch (error) {
        console.error('Error fetching platform statistics:', error);
        return null;
      }
    },
    enabled: isAdmin && userRole === 'global_admin'
  });

  const isLoading = isRoleLoading || isOrgsLoading || isUsersLoading || isStatsLoading;
  const error = roleError || orgsError || usersError;

  // Show error toast if there's an error
  if (error) {
    console.error('User management error:', error);
    toast.error("There was an error loading user management data");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedUser) {
        await updateUserMutation.mutateAsync({ 
          userId: selectedUser.id, 
          data: formData 
        });
        setIsEditUserOpen(false);
      } else {
        await createUserMutation.mutateAsync(formData);
        setIsAddUserOpen(false);
      }
      
      // Reset form
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        role: "staff",
        organizationId: "",
      });
      setSelectedUser(null);
    } catch (error) {
      // Error handling is done in mutation callbacks
      console.error('Form submission error:', error);
    }
  };

  // Function to update a user's last activity
  const updateUserActivity = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Also increment action count in user_statistics
      const { error: statsError } = await supabase
        .from('user_statistics')
        .upsert({ 
          user_id: userId, 
          action_count: 1
        }, { 
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
        
      if (statsError) throw statsError;
      
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  };

  return {
    isAdmin,
    userRole,
    organizations,
    users,
    isLoading,
    error,
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    handleSubmit,
    createUserMutation,
    updateUserMutation,
    userProfile,
    statistics,
    updateUserActivity
  };
};
