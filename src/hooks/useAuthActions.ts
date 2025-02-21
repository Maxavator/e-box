
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";
import type { UserRoleType } from "@/types/database";

interface UseAuthActionsProps {
  email: string;
  password: string;
  setIsLoading: (loading: boolean) => void;
  navigate: (path: string) => void;
}

const handleLogin = async ({
  email,
  password,
  setIsLoading,
  navigate,
}: UseAuthActionsProps) => {
  if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }

  setIsLoading(true);
  console.log('Starting login process...');

  try {
    // Transform SA ID to email format if needed
    const loginEmail = isSaId(email) ? `${email}@said.auth` : email;

    // First check if we have an existing session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut();
    }

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      console.error('Auth error:', error);
      throw new Error(error.message);
    }

    if (!data?.user) {
      throw new Error('No user data returned');
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    if (roleError && !roleError.message.includes('no rows returned')) {
      console.error('Role fetch error:', roleError);
      throw new Error('Error fetching user role');
    }

    // Default to 'user' if no role is found
    const userRole: UserRoleType = (roleData?.role as UserRoleType) || 'user';
    console.log('Role fetched:', userRole);
    
    toast.success("Login successful!");

    // Navigate based on user role
    if (userRole === 'global_admin' || userRole === 'org_admin') {
      navigate("/admin");
    } else {
      navigate("/chat");
    }

  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'Login failed. Please try again.';

    // Map common error messages to user-friendly versions
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password';
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Please verify your email address';
    } else if (error.message.includes('Rate limit exceeded')) {
      errorMessage = 'Too many login attempts. Please wait a moment';
    }

    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

export const useAuthActions = (props: UseAuthActionsProps) => {
  return {
    handleLogin: () => handleLogin(props),
  };
};
