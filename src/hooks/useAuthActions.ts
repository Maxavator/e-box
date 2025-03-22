
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId, formatSaIdToEmail, validateSaId, formatSaIdPassword } from "@/utils/saIdValidation";
import type { UserRoleType } from "@/types/database";

interface UseAuthActionsProps {
  email: string; // Will be interpreted as saId
  password: string;
  setIsLoading: (loading: boolean) => void;
  navigate: (path: string) => void;
}

const handleLogin = async ({
  email: saId,
  password,
  setIsLoading,
  navigate,
}: UseAuthActionsProps) => {
  // Validate SA ID
  const validation = validateSaId(saId);
  if (!validation.isValid) {
    toast.error(validation.message || "Invalid SA ID");
    return;
  }

  setIsLoading(true);
  console.log('Starting login process...');

  try {
    // Clear any existing sessions first to avoid conflicts
    await supabase.auth.signOut();
    
    // Transform SA ID to email format
    const loginEmail = formatSaIdToEmail(saId);
    console.log(`Using SA ID format for login: ${loginEmail}`);
    
    // Always use the standard password for SA ID logins
    const loginPassword = formatSaIdPassword(saId);
    
    console.log(`Attempting login with SA ID: ${saId} (email: ${loginEmail})`);

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      console.error('Auth error:', error);
      
      // Map Supabase errors to user-friendly messages
      const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Invalid SA ID or password',
        'Email not confirmed': 'Account not activated. Please contact support.',
        'Rate limit exceeded': 'Too many login attempts. Please wait a moment',
        'Database error': 'Service temporarily unavailable. Please try again',
      };

      const errorMessage = errorMap[Object.keys(errorMap).find(key => error.message?.includes(key)) || ''] 
        || 'Unable to connect. Please try again.';
      
      throw new Error(errorMessage);
    }

    if (!data.user) {
      throw new Error('Login failed. Please try again.');
    }

    // Get user role from user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (roleError) {
      console.error('Role fetch error:', roleError);
      toast.error("Error fetching user role. Please try again.");
      return;
    }

    // Default to 'user' if no role is found
    const userRole: UserRoleType = roleData?.role || 'user';
    console.log('Role fetched:', userRole);
    
    toast.success("Login successful!");

    // Navigate based on user role
    if (userRole === 'global_admin' || userRole === 'org_admin') {
      navigate("/admin");
    } else {
      navigate("/chat");
    }

  } catch (error: any) {
    const errorMessage = error?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    console.error('Login error:', error);
  } finally {
    setIsLoading(false);
  }
};

export const useAuthActions = (props: UseAuthActionsProps) => {
  return {
    handleLogin: () => handleLogin(props),
  };
};
