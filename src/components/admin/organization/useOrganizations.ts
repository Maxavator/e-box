
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Organization } from "../types";

export interface OrganizationFormData {
  name: string;
  domain: string;
  logo_url?: string;
}

export const useOrganizations = () => {
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    domain: "",
    logo_url: "",
  });

  const queryClient = useQueryClient();

  // First, get the current authenticated user
  const { data: { user } = { user: null } } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Not authenticated");
      return { user };
    },
  });

  // Then check if the user is an admin
  const { data: isAdmin } = useQuery({
    queryKey: ['isGlobalAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'global_admin')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });

  // Finally fetch organizations if user is admin
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async () => {
      if (!user?.id || !isAdmin) {
        throw new Error("Not authorized to view organizations");
      }

      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          profiles (
            id
          )
        `)
        .order('name');

      if (error) throw error;

      return data.map(org => ({
        ...org,
        profiles: {
          count: org.profiles?.length || 0
        }
      })) as Organization[];
    },
    enabled: !!user?.id && isAdmin === true,
  });

  const createMutation = useMutation({
    mutationFn: async (newOrg: OrganizationFormData) => {
      if (!user?.id || !isAdmin) {
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
      setIsAddOrgOpen(false);
      setFormData({ name: "", domain: "", logo_url: "" });
      toast.success("Organization created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create organization: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OrganizationFormData }) => {
      if (!user?.id || !isAdmin) {
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
      setIsEditOrgOpen(false);
      setSelectedOrg(null);
      toast.success("Organization updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update organization: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id || !isAdmin) {
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
    onError: (error) => {
      toast.error("Failed to delete organization: " + error.message);
    },
  });

  return {
    organizations,
    isLoading,
    isAdmin,
    isAddOrgOpen,
    setIsAddOrgOpen,
    isEditOrgOpen,
    setIsEditOrgOpen,
    formData,
    selectedOrg,
    setSelectedOrg,
    setFormData,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
