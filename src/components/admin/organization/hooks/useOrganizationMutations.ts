
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { OrganizationFormData } from "../types";
import { toast } from "sonner";

export const useOrganizationMutations = (session: Session | null, isAdmin: boolean | undefined) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newOrg: OrganizationFormData) => {
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      if (!isAdmin) {
        throw new Error("Not authorized to create organizations");
      }

      const { data, error } = await supabase
        .from('organizations')
        .insert([{ 
          name: newOrg.name, 
          domain: newOrg.domain || null,
          logo_url: newOrg.logo_url || null
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success("Organization created successfully");
    },
    onError: (error: Error) => {
      console.error('Create organization error:', error);
      toast.error("Failed to create organization: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OrganizationFormData }) => {
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      if (!isAdmin) {
        throw new Error("Not authorized to update organizations");
      }

      const { error } = await supabase
        .from('organizations')
        .update({ 
          name: data.name, 
          domain: data.domain || null,
          logo_url: data.logo_url || null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success("Organization updated successfully");
    },
    onError: (error: Error) => {
      console.error('Update organization error:', error);
      toast.error("Failed to update organization: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      if (!isAdmin) {
        throw new Error("Not authorized to delete organizations");
      }

      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success("Organization deleted successfully");
    },
    onError: (error: Error) => {
      console.error('Delete organization error:', error);
      toast.error("Failed to delete organization: " + error.message);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
