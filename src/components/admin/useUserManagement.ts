
import { useState } from "react";
import { useUserRole } from "./hooks/useUserRole";
import { useOrganizations } from "./hooks/useOrganizations";
import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";
import type { UserWithRole, UserFormData } from "./types";
import { toast } from "sonner";

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

  const { isAdmin, userRole, isLoading: isRoleLoading, error: roleError } = useUserRole();
  const { organizations, userProfile, isLoading: isOrgsLoading, error: orgsError } = useOrganizations(isAdmin, userRole);
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers(isAdmin, userRole, userProfile);
  const { updateUserMutation } = useUserMutations(isAdmin, userRole, userProfile);

  const isLoading = isRoleLoading || isOrgsLoading || isUsersLoading;
  const error = roleError || orgsError || usersError;

  // Show error toast if there's an error
  if (error) {
    console.error('User management error:', error);
    toast.error("There was an error loading user management data");
  }

  return {
    isAdmin,
    userRole,
    organizations,
    users,
    isLoading,
    error,
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
