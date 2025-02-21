
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
    // First sign out to ensure clean state
    await supabase.auth.signOut();
    
    // Transform SA ID to email format if needed
    const loginEmail = isSaId(email) ? `${email}@said.auth` : email;

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      console.error('Auth error:', error);
      throw error;
    }

    if (!data?.user) {
      throw new Error('No user data returned');
    }

    console.log('Successfully authenticated user:', data.user.id);

    // Fetch user role with error handling
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (roleError) {
      console.error('Role fetch error:', roleError);
      // Default to chat route if role fetch fails
      toast.success("Login successful!");
      navigate("/chat");
      return;
    }

    const userRole = roleData?.role as UserRoleType || 'user';
    console.log('User role:', userRole);

    toast.success("Login successful!");

    // Navigate based on role
    if (userRole === 'global_admin' || userRole === 'org_admin') {
      navigate("/admin");
    } else {
      navigate("/chat");
    }

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Map error messages to user-friendly versions
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please verify your email address',
      'Rate limit exceeded': 'Too many attempts. Please try again later',
      'Service unavailable': 'Service temporarily unavailable. Please try again'
    };

    const errorMessage = errorMessages[Object.keys(errorMessages).find(key => 
      error.message?.includes(key)
    ) ?? ''] || 'Login failed. Please try again';

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
