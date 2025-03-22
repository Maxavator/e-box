
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "./saIdValidation";

export const createGlobalAdmin = async () => {
  try {
    console.log("Creating global admin user...");
    
    const saId = "4001015000080";
    const password = "Admin@2025!Security";
    
    // Validate SA ID
    if (!isSaId(saId)) {
      toast.error("Invalid SA ID format");
      return;
    }
    
    // Format email from SA ID
    const email = `${saId}@said.auth`;
    
    console.log("Creating new admin user with email:", email);
    
    // Create auth user directly using signUp instead of admin API
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: "Global",
          last_name: "Administrator"
        },
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });

    if (authError) {
      console.error("Failed to create admin user:", authError);
      
      // Special case: if user already exists, we'll try to sign in and update role
      if (authError.message.includes("already exists")) {
        toast.info("Admin user already exists, attempting to sign in and update role");
        
        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
        
        if (signInError) {
          toast.error("Failed to authenticate with existing admin account: " + signInError.message);
          return;
        }
        
        if (!signInData.user) {
          toast.error("Failed to authenticate with existing admin account: No user returned");
          return;
        }
        
        // Update user role to global_admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: signInData.user.id,
            role: 'global_admin'
          });
          
        if (roleError) {
          console.error("Error updating user role:", roleError);
          toast.error("Failed to update user role: " + roleError.message);
          return;
        }
        
        toast.success("User updated to global admin successfully");
        toast.info(`Login with ID: ${saId} and password: ${password}`);
        
        // Sign out after making changes
        await supabase.auth.signOut();
        
        return;
      }
      
      toast.error("Failed to create admin user: " + authError.message);
      return;
    }

    if (!authData.user) {
      console.error("No user returned");
      toast.error("Failed to create admin user: No user returned");
      return;
    }

    console.log("Auth user created successfully with ID:", authData.user.id);

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        first_name: "Global",
        last_name: "Administrator"
      });

    if (profileError) {
      console.error("Failed to create admin profile:", profileError);
      toast.error("Failed to create admin profile: " + profileError.message);
      return;
    }

    // Assign global_admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'global_admin'
      });

    if (roleError) {
      console.error("Failed to assign admin role:", roleError);
      toast.error("Failed to assign admin role: " + roleError.message);
      return;
    }

    // Sign out after creating the admin user
    await supabase.auth.signOut();

    console.log("Global admin created successfully");
    toast.success("Global admin created successfully");
    toast.info(`Login with ID: ${saId} and password: ${password}`);
    toast.info("If you don't receive a confirmation email, use the 'Check Account / Reset Password' button to reset your password and activate your account.");
    
  } catch (error: any) {
    console.error("Error creating global admin:", error);
    toast.error("Failed to create global admin: " + error.message);
  }
};
