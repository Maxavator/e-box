
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

  const { isAdmin, userRole, isLoading: isRoleLoading } = useUserRole();
  const { organizations, userProfile, isLoading: isOrgsLoading, error: orgsError } = useOrganizations(isAdmin, userRole);
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers(isAdmin, userRole, userProfile);
  const { createUserMutation, updateUserMutation } = useUserMutations(isAdmin, userRole, userProfile);

  const isLoading = isRoleLoading || isOrgsLoading || isUsersLoading;
  const error = orgsError || usersError;

  // Show error toast if there's an error
  if (error) {
    console.error('User management error:', error);
    toast.error("There was an error loading user management data");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedUser) {
        await updateUserMutation.mutateAsync({ 
          userId: selectedUser.id, 
          data: formData 
        });
        setIsEditUserOpen(false);
      } else {
        await createUserMutation.mutateAsync(formData);
        setIsAddUserOpen(false);
      }
      
      // Reset form
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        role: "staff",
        organizationId: "",
      });
      setSelectedUser(null);
    } catch (error) {
      // Error handling is done in mutation callbacks
      console.error('Form submission error:', error);
    }
  };

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
    handleSubmit,
    createUserMutation,
    updateUserMutation,
    userProfile,
  };
};
