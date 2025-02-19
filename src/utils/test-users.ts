
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type TestUser = {
  email: string;
  password: string;
  role: "staff" | "org_admin" | "global_admin";
  saId: string;
};

export const createTestUsers = async (setIsCreating: (value: boolean) => void) => {
  setIsCreating(true);

  try {
    // Create a test organization first
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([{ name: 'Test Organization', domain: 'test.org' }])
      .select()
      .single();

    if (orgError) throw orgError;

    // Create test users with their roles
    const users: TestUser[] = [
      { email: '6010203040512', password: 'Test6010203040512', role: 'staff', saId: '6010203040512' },
      { email: '5010203040512', password: 'Test5010203040512', role: 'org_admin', saId: '5010203040512' },
      { email: '4010203040512', password: 'Test4010203040512', role: 'global_admin', saId: '4010203040512' }
    ];

    for (const user of users) {
      // Create user in auth system
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            first_name: user.role === 'staff' ? 'Regular' : user.role === 'org_admin' ? 'Org' : 'Global',
            last_name: user.role === 'staff' ? 'User' : 'Admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with SA ID and organization
        await supabase
          .from('profiles')
          .update({ 
            sa_id: user.saId,
            organization_id: orgData.id 
          })
          .eq('id', authData.user.id);

        // Insert user role
        await supabase
          .from('user_roles')
          .insert({ 
            user_id: authData.user.id,
            role: user.role 
          });
      }
    }

    toast({
      title: "Test Users Created",
      description: "All test users have been created successfully.",
    });
  } catch (error) {
    console.error('Error creating test users:', error);
    toast({
      title: "Error Creating Users",
      description: "Failed to create test users. Check console for details.",
      variant: "destructive",
    });
  } finally {
    setIsCreating(false);
  }
};
