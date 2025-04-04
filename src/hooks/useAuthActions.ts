
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
    
    // Always use the standard password for SA ID logins - ignore any password input from the form
    const loginPassword = formatSaIdPassword(saId);
    console.log(`Using standard password for login`);
    
    console.log(`Attempting login with SA ID: ${saId} (email: ${loginEmail})`);

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      console.error('Auth error:', error);
      
      // Check if the user might not exist - we could try creating the user
      if (error.message?.includes('Invalid login credentials')) {
        console.log('User might not exist, attempting to create account...');
        
        // Try to create the user account first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: loginEmail,
          password: loginPassword,
          options: {
            data: {
              sa_id: saId
            }
          }
        });
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          
          // If user already exists but password might be wrong, provide clear error
          if (signUpError.message?.includes('User already registered')) {
            throw new Error('Account exists but credentials may be incorrect. Please contact support.');
          }
          
          throw new Error(signUpError.message || 'Failed to create account');
        }
        
        if (signUpData?.user) {
          console.log('Account created successfully, attempting login again...');
          
          // Try login again after creating account
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
          });
          
          if (loginError) {
            console.error('Second login attempt error:', loginError);
            throw new Error('Account created but login failed. Please try again.');
          }
          
          if (!loginData.user) {
            throw new Error('Login failed after account creation. Please try again.');
          }
          
          // Continue with the newly created and logged in user
          data.user = loginData.user;
          data.session = loginData.session;
          
          // Update the profile with the SA ID - we KNOW the profile is new here
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ sa_id: saId })
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error('Error updating profile with SA ID:', profileError);
          }
        }
      } else {
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
    
    // Check if profile already has SA ID before updating
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('sa_id')
        .eq('id', data.user.id)
        .single();
        
      // Only update profile if SA ID is not set yet
      if (!profile?.sa_id) {
        console.log('Profile has no SA ID, updating with:', saId);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ sa_id: saId })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating profile SA ID:', updateError);
        }
      } else {
        console.log('Profile already has SA ID:', profile.sa_id, 'skipping update');
      }
    } catch (e) {
      console.error('Error checking/updating SA ID in profile:', e);
    }
    
    toast.success("Login successful!");

    // Always redirect to dashboard regardless of role
    navigate("/dashboard");

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
