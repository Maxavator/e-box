
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserToCreate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'global_admin' | 'org_admin' | 'staff' | 'user';
  title: string;
}

export const createGolderOrg = async () => {
  try {
    // First create the global admin
    console.log("Creating global admin...");
    const globalAdmin = await createGlobalAdmin();
    
    if (!globalAdmin) {
      toast.error("Failed to create global admin");
      return;
    }

    // Step 1: Create the organization
    console.log("Creating Golder organization...");
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: 'Golder (Pty) Ltd.',
        domain: 'golder.co.za'
      })
      .select()
      .single();

    if (orgError) {
      console.error("Failed to create organization:", orgError);
      toast.error("Failed to create organization: " + orgError.message);
      return;
    }

    console.log("Organization created successfully:", orgData);
    toast.success("Organization created successfully");

    const orgId = orgData.id;

    // Step 2: Create users
    const usersToCreate: UserToCreate[] = [
      {
        id: '9001075800087',
        firstName: 'Bongani',
        lastName: 'Khumalo',
        email: 'bongani.khumalo@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '9209015800084',
        firstName: 'Lesego',
        lastName: 'Motaung',
        email: 'lesego.motaung@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '8711120800188',
        firstName: 'Lindiwe',
        lastName: 'Mbatha',
        email: 'lindiwe.mbatha@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '8908075800086',
        firstName: 'Mandla',
        lastName: 'Tshabalala',
        email: 'mandla.tshabalala@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '9012120800185',
        firstName: 'Nomvula',
        lastName: 'Dlamini',
        email: 'nomvula.dlamini@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '9105120800187',
        firstName: 'Precious',
        lastName: 'Mokoena',
        email: 'precious.mokoena@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '8703075800083',
        firstName: 'Sipho',
        lastName: 'Mabaso',
        email: 'sipho.mabaso@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '8801015800082',
        firstName: 'Thabo',
        lastName: 'Nkosi',
        email: 'thabo.nkosi@golder.co.za',
        role: 'org_admin',
        title: 'Organization Administrator'
      },
      {
        id: '8504075800085',
        firstName: 'Themba',
        lastName: 'Zulu',
        email: 'themba.zulu@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      },
      {
        id: '8606120800186',
        firstName: 'Zanele',
        lastName: 'Ndlovu',
        email: 'zanele.ndlovu@golder.co.za',
        role: 'user',
        title: 'Staff Member'
      }
    ];

    console.log("Starting user creation for Golder organization...");
    toast.info("Creating users... This may take a moment.");
    
    let successCount = 0;
    let errorCount = 0;

    // Create each user
    for (const user of usersToCreate) {
      try {
        console.log(`Creating user: ${user.firstName} ${user.lastName}`);
        
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'StaffPass123!',
          email_confirm: true,
          user_metadata: {
            first_name: user.firstName,
            last_name: user.lastName,
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

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: user.firstName,
            last_name: user.lastName,
            organization_id: orgId
          });

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
    
    if (successCount === usersToCreate.length) {
      toast.success(`All ${successCount} users created successfully!`);
    } else if (successCount > 0) {
      toast.success(`Created ${successCount} users successfully`);
      if (errorCount > 0) {
        toast.error(`Failed to create ${errorCount} users. Check console for details.`);
      }
    } else {
      toast.error("Failed to create any users. Check console for details.");
    }

  } catch (error) {
    console.error("Error in creating organization:", error);
    toast.error("Failed to create organization. Check console for details.");
  }
};

// Function to create global admin
const createGlobalAdmin = async () => {
  try {
    console.log("Creating global admin: Max Dlamini");
    
    // Create auth user for global admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'm@ramutla.com',
      password: 'Admin@2025!Security',
      email_confirm: true,
      user_metadata: {
        first_name: 'Max',
        last_name: 'Dlamini',
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

    // Create profile for global admin
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        first_name: 'Max',
        last_name: 'Dlamini'
      });

    if (profileError) {
      console.error("Failed to create global admin profile:", profileError);
      toast.error("Failed to create global admin profile: " + profileError.message);
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
