
import { useUserRole } from "../../hooks/useUserRole";
import { useSupabaseSession } from "./useAuthSession";
import { Session } from "@supabase/supabase-js";

export const useAdminStatus = () => {
  const { isAdmin, userRole, isLoading, error } = useUserRole();
  const { session } = useSupabaseSession();
  
  return {
    isAdmin,
    userRole,
    isLoading,
    error,
    session
  };
};

export const useSupabaseSession = () => {
  const { session } = useSupabaseSession();
  return { session };
};
