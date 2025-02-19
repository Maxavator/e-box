
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { OrganizationForm } from "./organization/OrganizationForm";
import { OrganizationTable } from "./organization/OrganizationTable";
import type { Organization } from "./types";

export const OrganizationManagement = () => {
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<{ name: string; domain: string; }>({
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
    mutationFn: async (newOrg: typeof formData) => {
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
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Organization Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor organizations across the platform
          </p>
        </div>
        <Dialog open={isAddOrgOpen} onOpenChange={setIsAddOrgOpen}>
          <DialogTrigger asChild>
            <Button>
              <Building2 className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
            </DialogHeader>
            <OrganizationForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              mode="add"
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOrgOpen} onOpenChange={setIsEditOrgOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
            </DialogHeader>
            <OrganizationForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              mode="edit"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <OrganizationTable
          organizations={organizations || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
