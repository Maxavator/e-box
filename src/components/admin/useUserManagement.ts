
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

  const { data: isAdmin } = useQuery({
    queryKey: ['isGlobalAdmin'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_global_admin');
      if (error) throw error;
      return data;
    },
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data?.role;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'org_admin',
  });

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to view organizations");
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: isAdmin || userRole === 'org_admin',
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to view users");
      }

      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey (role),
          organizations (name)
        `);

      if (userRole === 'org_admin' && userProfile?.organization_id) {
        query = query.eq('organization_id', userProfile.organization_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(profile => ({
        ...profile,
        user_roles: profile.user_roles ? [profile.user_roles] : [],
        organizations: profile.organizations ? [profile.organizations] : []
      })) as UserWithRole[];
    },
    enabled: (isAdmin || userRole === 'org_admin') && (!userRole || userRole === 'org_admin' ? !!userProfile?.organization_id : true),
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: UserFormData }) => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to update users");
      }

      // Check if org admin is trying to update users from other organizations
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
    isLoading,
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
