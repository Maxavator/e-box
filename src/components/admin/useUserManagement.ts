
import { useState, useEffect } from "react";
import { useUserRole } from "./hooks/useUserRole";
import { useOrganizations } from "./hooks/useOrganizations";
import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";
import type { UserWithRole, UserFormData } from "./types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [golderOrgId, setGolderOrgId] = useState<string | null>(null);
  const [showingGolderUsers, setShowingGolderUsers] = useState(false);

  const { isAdmin, userRole, isLoading: isRoleLoading, error: roleError } = useUserRole();
  const { organizations, userProfile, isLoading: isOrgsLoading, error: orgsError } = useOrganizations(isAdmin, userRole);
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers(
    isAdmin, 
    userRole, 
    userProfile, 
    refreshUsers,
    showingGolderUsers ? golderOrgId : null
  );
  const { createUserMutation, updateUserMutation } = useUserMutations(isAdmin, userRole, userProfile);

  const isLoading = isRoleLoading || isOrgsLoading || isUsersLoading;
  const error = roleError || orgsError || usersError;

  // Find the Golder organization ID when organizations are loaded
  useEffect(() => {
    const findGolderOrg = async () => {
      if (organizations?.length) {
        const golderOrg = organizations.find(
          org => org.name.toLowerCase().includes('golder')
        );
        
        if (golderOrg) {
          setGolderOrgId(golderOrg.id);
        } else {
          // If not found in organizations list, try direct DB query
          const { data, error } = await supabase
            .from('organizations')
            .select('id')
            .ilike('name', '%golder%')
            .maybeSingle();
            
          if (!error && data?.id) {
            setGolderOrgId(data.id);
            console.log("Found Golder organization via direct query:", data.id);
          } else {
            console.log("Golder organization not found in DB");
          }
        }
      }
    };
    
    findGolderOrg();
  }, [organizations]);

  // Set up a polling interval to refresh the users list every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshUsers(prev => prev + 1);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const refreshUsersList = () => {
    setRefreshUsers(prev => prev + 1);
  };

  // Toggle showing all Golder users
  const toggleGolderUsers = () => {
    setShowingGolderUsers(prev => !prev);
    refreshUsersList();
  };

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
      
      // Refresh the users list
      refreshUsersList();
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
    refreshUsersList,
    showingGolderUsers,
    toggleGolderUsers,
    golderOrgId,
  };
};
