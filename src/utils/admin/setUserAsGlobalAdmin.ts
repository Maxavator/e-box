
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Sets a user as a global admin based on their SA ID number
 * @param saId The South African ID number of the user to promote
 * @returns A boolean indicating whether the operation was successful
 */
export const setUserAsGlobalAdmin = async (saId: string): Promise<boolean> => {
  try {
    // Find the user by their SA ID
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('sa_id', saId)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error finding user with SA ID:", profileError);
      toast.error("Error finding user with the provided SA ID");
      return false;
    }
    
    if (!profileData) {
      console.error("No user found with SA ID:", saId);
      toast.error("No user found with the provided SA ID");
      return false;
    }
    
    // Update or insert the user_roles record to set the user as global_admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: profileData.id,
        role: 'global_admin'
      });
      
    if (roleError) {
      console.error("Error setting user as global admin:", roleError);
      toast.error("Error updating user role");
      return false;
    }
    
    const userName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User';
    toast.success(`${userName} has been set as a Global Admin`);
    console.log(`User ${userName} (ID: ${profileData.id}) with SA ID ${saId} set as global_admin`);
    
    return true;
  } catch (error) {
    console.error("Unexpected error setting user as global admin:", error);
    toast.error("Unexpected error occurred while updating user role");
    return false;
  }
};
