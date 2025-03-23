
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { UserToCreate } from "./golderUserDefinitions";

/**
 * Creates multiple users for an organization
 * @param users Array of users to create
 * @param orgId Organization ID to assign users to
 * @returns Object with counts of successful and failed user creations
 */
export const createOrganizationUsers = async (users: UserToCreate[], orgId: string) => {
  console.log("Starting user creation for organization...");
  toast.info("Creating users... This may take a moment.");
  
  let successCount = 0;
  let errorCount = 0;

  // Create each user
  for (const user of users) {
    try {
      console.log(`Creating user: ${user.firstName} ${user.lastName}`);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: 'StaffPass123!',
        options: {
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
            sa_id: user.saId
          }
        }
      });

      if (authError) {
        console.error(`Failed to create auth user ${user.email}:`, authError);
        errorCount++;
        continue;
      }

      if (!authData.user) {
        console.error(`No user returned for ${user.email}`);
        errorCount++;
        continue;
      }

      console.log(`Auth user created with ID: ${authData.user.id} for ${user.email}`);

      // Wait for a moment to ensure the auth user trigger has time to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Also create a SA ID login by linking additional identity
      const saIdEmail = `${user.saId}@said.auth`;
      console.log(`Creating additional login method with SA ID: ${saIdEmail}`);
      
      try {
        // Create an additional user with SA ID format for login
        const { data: saAuthData, error: saAuthError } = await supabase.auth.signUp({
          email: saIdEmail,
          password: 'StaffPass123!',
          options: {
            data: {
              first_name: user.firstName,
              last_name: user.lastName,
              sa_id: user.saId,
              primary_email: user.email
            }
          }
        });
        
        if (saAuthError) {
          console.log(`Note: Could not create additional SA ID login for ${user.email}:`, saAuthError);
          // Continue anyway as this is just an additional login method
        } else {
          console.log(`Successfully created SA ID login for ${user.firstName} ${user.lastName}`);
        }
      } catch (saIdError) {
        console.log(`Error creating SA ID login for ${user.email}:`, saIdError);
        // Continue anyway as this is just an additional login method
      }

      // Update profile with organization_id and job_title
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: user.firstName,
          last_name: user.lastName,
          organization_id: orgId,
          job_title: user.jobTitle
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`Failed to update profile for ${user.email}:`, profileError);
        errorCount++;
        continue;
      }

      // Assign role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: user.role
        });

      if (roleError) {
        console.error(`Failed to assign role to ${user.email}:`, roleError);
        errorCount++;
        continue;
      }

      successCount++;
      console.log(`User created successfully: ${user.email}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
      errorCount++;
    }
  }

  console.log(`Completed user creation. Success: ${successCount}, Failed: ${errorCount}`);
  
  return { successCount, errorCount };
};
