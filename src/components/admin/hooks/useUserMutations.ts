
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

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: UserFormData }) => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to update users");
      }

      if (userRole === 'org_admin' && userProfile?.organization_id !== data.organizationId) {
        throw new Error("You don't have permission to update users from other organizations");
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

        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: data.role as Database['public']['Enums']['user_role'],
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

  return { updateUserMutation };
};
