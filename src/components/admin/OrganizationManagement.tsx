
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationTable } from "./organization/OrganizationTable";
import { OrganizationDialogs } from "./organization/OrganizationDialogs";
import { useOrganizations } from "./organization/useOrganizations";
import { QuickStatsCard } from "../organization/cards/QuickStatsCard";
import { AfrovationUsers } from "./AfrovationUsers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "./hooks/useUserRole";

const OrganizationManagement = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading: isRoleLoading } = useUserRole();
  
  const {
    organizations,
    isLoading,
    isAddOrgOpen,
    setIsAddOrgOpen,
    isEditOrgOpen,
    setIsEditOrgOpen,
    formData,
    setFormData,
    selectedOrg,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useOrganizations();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to access this page");
        navigate("/auth");
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  // Redirect if not admin
  useEffect(() => {
    if (!isRoleLoading && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, isRoleLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    try {
      if (selectedOrg) {
        await updateMutation.mutateAsync({ id: selectedOrg.id, data: formData });
        toast.success("Organization updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Organization created successfully");
      }
      setIsAddOrgOpen(false);
      setIsEditOrgOpen(false);
    } catch (error) {
      console.error('Organization operation failed:', error);
      toast.error("Failed to perform organization operation");
    }
  };

  const handleEdit = (org: typeof organizations[0]) => {
    if (!isAdmin) {
      toast.error("You don't have permission to edit organizations");
      return;
    }
    
    setFormData({
      name: org.name,
      domain: org.domain || "",
      logo_url: org.logo_url || "",
    });
    setIsEditOrgOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to delete organizations");
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Organization deleted successfully");
    } catch (error) {
      console.error('Failed to delete organization:', error);
      toast.error("Failed to delete organization");
    }
  };

  if (isRoleLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Organization Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor organizations across the platform
          </p>
        </div>
        {isAdmin && (
          <OrganizationDialogs
            isAddOrgOpen={isAddOrgOpen}
            setIsAddOrgOpen={setIsAddOrgOpen}
            isEditOrgOpen={isEditOrgOpen}
            setIsEditOrgOpen={setIsEditOrgOpen}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </div>

      {isAdmin && <AfrovationUsers />}

      <QuickStatsCard />

      <div className="border rounded-lg">
        <OrganizationTable
          organizations={organizations || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default OrganizationManagement;
