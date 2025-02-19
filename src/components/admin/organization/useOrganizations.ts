
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Organization } from "../types";

export interface OrganizationFormData {
  name: string;
  domain: string;
}

export const useOrganizations = () => {
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    domain: "",
  });

  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*, profiles:profiles(count)')
        .order('name');
      if (error) throw error;
      return data as Organization[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newOrg: OrganizationFormData) => {
      const { data, error } = await supabase
        .from('organizations')
        .insert([{ name: newOrg.name, domain: newOrg.domain || null }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setIsAddOrgOpen(false);
      setFormData({ name: "", domain: "" });
      toast.success("Organization created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create organization: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OrganizationFormData }) => {
      const { error } = await supabase
        .from('organizations')
        .update({ name: data.name, domain: data.domain || null })
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrg) {
      updateMutation.mutate({ id: selectedOrg.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      domain: org.domain || "",
    });
    setIsEditOrgOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    organizations,
    isLoading,
    isAddOrgOpen,
    setIsAddOrgOpen,
    isEditOrgOpen,
    setIsEditOrgOpen,
    formData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleInputChange,
  };
};
