
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationTable } from "./organization/OrganizationTable";
import { OrganizationDialogs } from "./organization/OrganizationDialogs";
import { useOrganizations } from "./organization/useOrganizations";
import { QuickStatsCard } from "../organization/cards/QuickStatsCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OrganizationManagement = () => {
  const navigate = useNavigate();
  
  const {
    organizations,
    isLoading,
    isAdmin,
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
    if (isAdmin === false) {
      toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrg) {
      updateMutation.mutate({ id: selectedOrg.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (org: typeof organizations[0]) => {
    setFormData({
      name: org.name,
      domain: org.domain || "",
      logo_url: org.logo_url || "",
    });
    setIsEditOrgOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Organization Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor organizations across the platform
          </p>
        </div>
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
      </div>

      <QuickStatsCard />

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

export default OrganizationManagement;
