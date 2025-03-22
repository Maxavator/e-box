
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
    const { data: { users } } = await supabase.auth.admin.listUsers();
    
    const existingUser = users?.find(u => {
      if (typeof u === 'object' && u !== null && 'email' in u) {
        return (u as { email: string }).email === email;
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
      return;
    }
    
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

    console.log("Auth user created successfully");

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: "Global",
        last_name: "Administrator"
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error("Failed to update admin profile:", profileError);
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
    
  } catch (error: any) {
    console.error("Error creating global admin:", error);
    toast.error("Failed to create global admin: " + error.message);
  }
};
