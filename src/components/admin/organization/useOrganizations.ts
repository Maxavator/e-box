
import { useState } from "react";
import { useAuthSession } from "./hooks/useAuthSession";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useOrganizationData } from "./hooks/useOrganizationData";
import { useOrganizationMutations } from "./hooks/useOrganizationMutations";
import type { Organization } from "../types";
import type { OrganizationFormData } from "./types";

export const useOrganizations = () => {
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    domain: "",
    logo_url: "",
  });

  const { session } = useAuthSession();
  const { isAdmin } = useAdminStatus(session);
  const { organizations, isLoading } = useOrganizationData(session, isAdmin);
  const { createMutation, updateMutation, deleteMutation } = useOrganizationMutations(session, isAdmin);

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

export type { OrganizationFormData };
