
import { useState } from "react";
import { useUserRole } from "./hooks/useUserRole";
import { useOrganizations } from "./hooks/useOrganizations";
import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";
import type { UserWithRole, UserFormData } from "./types";

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

  const { isAdmin, userRole } = useUserRole();
  const { organizations, userProfile } = useOrganizations(isAdmin, userRole);
  const { users, isLoading } = useUsers(isAdmin, userRole, userProfile);
  const { updateUserMutation } = useUserMutations(isAdmin, userRole, userProfile);

  return {
    isAdmin,
    userRole,
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
    userProfile,
  };
};
