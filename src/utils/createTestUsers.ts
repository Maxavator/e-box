
import { supabase } from "@/integrations/supabase/client";

const createUser = async (saId: string, orgId: string, isAdmin: boolean) => {
  try {
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email: saId,
      password: `Test${saId}`,
      options: {
        data: {
          first_name: isAdmin ? 'BMC' : 'Staff',
          last_name: isAdmin ? 'Admin' : 'User',
          sa_id: saId
        }
      }
    });

    if (signUpError) throw signUpError;

    // The profile and default staff role will be created by the handle_new_user_signup trigger
    
    // If this is an admin user, update their role to org_admin
    if (isAdmin && authUser.user) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'org_admin' })
        .eq('user_id', authUser.user.id);

      if (roleError) throw roleError;
    }

    // Update the organization_id in the profile
    if (authUser.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ organization_id: orgId })
        .eq('id', authUser.user.id);

      if (profileError) throw profileError;
    }

    return { success: true, saId };
  } catch (error) {
    console.error(`Failed to create user ${saId}:`, error);
    return { success: false, saId, error };
  }
};

const generateSaId = () => {
  // Simple SA ID generator for testing
  const year = String(Math.floor(Math.random() * 99)).padStart(2, '0');
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `${year}${month}${day}${sequence}0880`;
};

export const createTestUsers = async () => {
  // Get the BMC Group organization ID
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('name', 'BMC Group')
    .single();

  if (orgError) {
    console.error('Failed to get organization:', orgError);
    return;
  }

  // Create admin user
  const adminResult = await createUser('5010203040512', org.id, true);
  console.log('Admin user creation result:', adminResult);

  // Create 20 staff users
  const staffResults = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const saId = generateSaId();
      return createUser(saId, org.id, false);
    })
  );

  console.log('Staff users creation results:', staffResults);
  
  return {
    admin: adminResult,
    staff: staffResults
  };
};
