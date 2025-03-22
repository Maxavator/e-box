
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
    const loginEmail = isSaId(email) ? `${email}@said.auth` : email;
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
      
      // Check if this is an email confirmation issue
      if (error.message.includes('Email not confirmed')) {
        toast.error("Your email is not confirmed. Please use the 'Check/Activate User' button to activate your account.");
        setIsLoading(false);
        return;
      }
      
      // Map Supabase errors to user-friendly messages
      const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Invalid email or password',
        'Email not confirmed': 'Please verify your email address or use the Activate button',
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
    
    // Update last_activity in profiles
    try {
      await supabase
        .from('profiles')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', data.user.id);
      
      // Update user_statistics
      await supabase
        .from('user_statistics')
        .upsert({
          user_id: data.user.id,
          last_login: new Date().toISOString(),
          login_count: 1
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
    } catch (statsError) {
      console.error('Error updating user activity stats:', statsError);
      // Don't fail the login if stats update fails
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
