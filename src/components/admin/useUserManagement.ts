
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { UserWithRole, UserFormData } from "./types";
import type { Database } from "@/integrations/supabase/types";

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

  const queryClient = useQueryClient();

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['isGlobalAdmin'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_global_admin');
      if (error) throw error;
      return data;
    },
  });

  const { data: userRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .single();
      if (error) throw error;
      return data?.role;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: userRole === 'org_admin',
  });

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin || userRole === 'org_admin',
  });

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role),
          organizations (name)
        `);

      if (userRole === 'org_admin' && userProfile?.organization_id) {
        query = query.eq('organization_id', userProfile.organization_id);
      }
      
      const { data: profiles, error: profilesError } = await query;
      
      if (profilesError) throw profilesError;
      return profiles as unknown as UserWithRole[];
    },
    enabled: !isAdminLoading && !isRoleLoading && (isAdmin || userRole === 'org_admin'),
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: UserFormData }) => {
      // Check if user has permission to update
      if (userRole === 'org_admin' && userProfile?.organization_id !== data.organizationId) {
        throw new Error("You don't have permission to update users from other organizations");
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          organization_id: data.organizationId || null,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: data.role as Database['public']['Enums']['user_role'],
        });

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditUserOpen(false);
      setSelectedUser(null);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  return {
    isAdmin,
    organizations,
    users,
    isLoading: isAdminLoading || isRoleLoading || isUsersLoading,
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    updateUserMutation,
    userRole,
    userProfile,
  };
};
