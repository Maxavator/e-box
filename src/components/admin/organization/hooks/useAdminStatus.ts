
import { useUserRole } from "../../hooks/useUserRole";
import { useAuthSession } from "./useAuthSession";

export const useAdminStatus = () => {
  const { isAdmin, userRole, isLoading, error } = useUserRole();
  const { session } = useAuthSession();
  
  return {
    isAdmin,
    userRole,
    isLoading,
    error,
    session
  };
};
