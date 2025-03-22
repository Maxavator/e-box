
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
    
    // Check if user already exists
    const { data, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      toast.error("Failed to check existing users: " + listError.message);
      return;
    }

    const users = data?.users || [];
    console.log("Found users:", users.length);
    
    const existingUser = users.find(u => {
      if (typeof u === 'object' && u !== null && 'email' in u) {
        const userEmail = (u as { email: string }).email;
        console.log("Checking user:", userEmail);
        return userEmail === email;
      }
      return false;
    });
    
    if (existingUser) {
      console.log("User already exists, updating to global admin role");
      
      // Update user role to global_admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: existingUser.id,
          role: 'global_admin'
        });
        
      if (roleError) {
        console.error("Error updating user role:", roleError);
        toast.error("Failed to update user role: " + roleError.message);
        return;
      }
      
      toast.success("User updated to global admin successfully");
      toast.info(`Login with ID: ${saId} and password: ${password}`);
      return;
    }
    
    console.log("Creating new admin user with email:", email);
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: "Global",
        last_name: "Administrator"
      }
    });

    if (authError) {
      console.error("Failed to create admin user:", authError);
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

    console.log("Global admin created successfully");
    toast.success("Global admin created successfully");
    toast.info(`Login with ID: ${saId} and password: ${password}`);
    
  } catch (error: any) {
    console.error("Error creating global admin:", error);
    toast.error("Failed to create global admin: " + error.message);
  }
};
