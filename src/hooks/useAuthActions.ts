
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

interface SupabaseUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
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
    // Clear any existing sessions first to avoid conflicts
    await supabase.auth.signOut();
    
    // Transform SA ID to email format if needed
    let loginEmail = email;
    if (isSaId(email)) {
      loginEmail = `${email}@said.auth`;
      console.log(`Using SA ID format for login: ${loginEmail}`);
    }
    console.log(`Attempting login with email: ${loginEmail}`);

    // Attempt login with retry logic
    let attempts = 0;
    const maxAttempts = 2;
    let loginResult;
    
    while (attempts < maxAttempts) {
      try {
        loginResult = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        
        if (loginResult.error) {
          console.error(`Login attempt ${attempts + 1} failed:`, loginResult.error);
          
          // If this is specific to invalid credentials and we're using an SA ID,
          // we'll try a different approach in the next iteration
          if (loginResult.error.message.includes('Invalid login credentials') && isSaId(email)) {
            console.log('Invalid credentials with SA ID format. Trying alternative method...');
          }
          
          throw loginResult.error;
        }
        
        console.log('Login successful:', loginResult);
        break; // If successful, exit the retry loop
      } catch (retryError) {
        console.log(`Login attempt ${attempts + 1} failed, retrying...`);
        attempts++;
        if (attempts >= maxAttempts) throw retryError;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
      }
    }

    const { data, error } = loginResult || { data: {}, error: new Error("Login failed") };

    if (error) {
      console.error('Auth error:', error);
      
      // Map Supabase errors to user-friendly messages
      const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Invalid email/ID or password',
        'Email not confirmed': 'Please verify your email address',
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
