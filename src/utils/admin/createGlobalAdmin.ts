
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Creates a global admin user for the system
 * @returns The created user object or null if creation failed
 */
export const createGlobalAdmin = async () => {
  try {
    // Updated global admin info
    const firstName = 'Max';
    const lastName = 'Ramutla';
    const email = 'm@ramutla.com';
    const saId = '4001015000080';
    const password = 'Admin@2025!Security';
    
    console.log(`Creating global admin: ${firstName} ${lastName}, email: ${email}, SA ID: ${saId}`);
    
    // Create auth user for global admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          sa_id: saId
        }
      }
    });

    if (authError) {
      console.error("Failed to create global admin auth user:", authError);
      toast.error("Failed to create global admin: " + authError.message);
      return null;
    }

    if (!authData.user) {
      console.error("No user returned for global admin");
      toast.error("Failed to create global admin: No user returned");
      return null;
    }

    // Create SA ID login for admin too
    try {
      const saIdEmail = `${saId}@said.auth`;
      const { error: saAuthError } = await supabase.auth.signUp({
        email: saIdEmail,
        password: 'StaffPass123!', // Using standard password for SA ID login
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            sa_id: saId,
            primary_email: email
          }
        }
      });
      
      if (saAuthError) {
        console.log(`Note: Could not create additional SA ID login for admin:`, saAuthError);
      } else {
        console.log(`Successfully created SA ID login for admin`);
      }
    } catch (saIdError) {
      console.log(`Error creating SA ID login for admin:`, saIdError);
    }

    // Wait for a moment to ensure the auth user trigger has time to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the profile instead of creating it (the trigger should have created it)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        job_title: 'Global Administrator'
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error("Failed to update global admin profile:", profileError);
      toast.error("Failed to update global admin profile: " + profileError.message);
      return null;
    }

    // Assign global_admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'global_admin'
      });

    if (roleError) {
      console.error("Failed to assign global_admin role:", roleError);
      toast.error("Failed to assign global_admin role: " + roleError.message);
      return null;
    }

    console.log("Global admin created successfully");
    toast.success("Global admin created successfully");
    
    return authData.user;
  } catch (error) {
    console.error("Error creating global admin:", error);
    toast.error("Failed to create global admin. Check console for details.");
    return null;
  }
};
