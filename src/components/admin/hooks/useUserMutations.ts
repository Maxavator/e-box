
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { UserFormData } from "../types";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "@/types/database";

export const useUserMutations = (
  isAdmin: boolean | undefined, 
  userRole: string | undefined, 
  userProfile: Profile | null | undefined
) => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to create users");
      }

      // For org_admin, enforce that they can only create users in their own organization
      if (userRole === 'org_admin') {
        if (!userProfile?.organization_id) {
          throw new Error("Your organization ID is missing");
        }
        
        if (data.organizationId && data.organizationId !== userProfile.organization_id) {
          throw new Error("You don't have permission to create users in other organizations");
        }
        
        // Always set organization ID to the admin's organization
        data.organizationId = userProfile.organization_id;
      }

      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          email_confirm: true,
          password: 'DefaultPass123!', // This will be changed on first login
          user_metadata: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create user");

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            organization_id: data.organizationId || null,
          });

        if (profileError) throw profileError;

        // Limit org_admin from creating global_admin users
        let role = data.role;
        if (userRole === 'org_admin' && role === 'global_admin') {
          role = 'org_admin'; // Downgrade to org_admin if they try to create global_admin
          toast.warning("You cannot create global admin users. User created as organization admin instead.");
        }

        // Assign role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: role as Database['public']['Enums']['user_role'],
          });

        if (roleError) throw roleError;

        return authData.user;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to create user: ${error.message}`);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: UserFormData }) => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to update users");
      }

      // For org_admin, enforce that they can only update users in their own organization
      if (userRole === 'org_admin') {
        if (!userProfile?.organization_id) {
          throw new Error("Your organization ID is missing");
        }
        
        // First check if the user belongs to the admin's organization
        const { data: userToUpdate, error: fetchError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', userId)
          .single();
          
        if (fetchError) throw fetchError;
        
        if (userToUpdate.organization_id !== userProfile.organization_id) {
          throw new Error("You don't have permission to update users from other organizations");
        }
        
        // Always set organization ID to the admin's organization
        data.organizationId = userProfile.organization_id;
      }
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            organization_id: data.organizationId || null,
          })
          .eq('id', userId);

        if (profileError) throw profileError;

        // Limit org_admin from updating to global_admin role
        let role = data.role;
        if (userRole === 'org_admin' && role === 'global_admin') {
          role = 'org_admin'; // Downgrade to org_admin if they try to set global_admin
          toast.warning("You cannot assign global admin role. User updated as organization admin instead.");
        }

        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: role as Database['public']['Enums']['user_role'],
          });

        if (roleError) throw roleError;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update user: ${error.message}`);
    }
  });

  return { createUserMutation, updateUserMutation };
};
