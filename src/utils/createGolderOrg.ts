
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserToCreate {
  firstName: string;
  lastName: string;
  saId: string;
  email: string;
  role: 'global_admin' | 'org_admin' | 'staff' | 'user';
  title: string;
  jobTitle: string;
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

    // Step 2: Create users with updated information and job titles
    const usersToCreate: UserToCreate[] = [
      {
        firstName: 'Bongani',
        lastName: 'Khumalo',
        saId: '9001075800087',
        email: 'bongani.khumalo@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Researcher'
      },
      {
        firstName: 'Lesego',
        lastName: 'Motaung',
        saId: '9209015800084',
        email: 'lesego.motaung@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Metoerologist'
      },
      {
        firstName: 'Lindiwe',
        lastName: 'Mbatha',
        saId: '8711120800188',
        email: 'lindiwe.mbatha@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Mining Engineer'
      },
      {
        firstName: 'Mandla',
        lastName: 'Tshabalala',
        saId: '8908075800086',
        email: 'mandla.tshabalala@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Mining Executive'
      },
      {
        firstName: 'Nomvula',
        lastName: 'Dlamini',
        saId: '9012120800185',
        email: 'nomvula.dlamini@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Chief Executive'
      },
      {
        firstName: 'Precious',
        lastName: 'Mokoena',
        saId: '9105120800187',
        email: 'precious.mokoena@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'HR Executive'
      },
      {
        firstName: 'Sipho',
        lastName: 'Mabaso',
        saId: '8703075800083',
        email: 'sipho.mabaso@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Revenue Executive'
      },
      {
        firstName: 'Thabo',
        lastName: 'Nkosi',
        saId: '8801015800082',
        email: 'thabo.nkosi@golder.co.za',
        role: 'org_admin',
        title: 'Organization Administrator',
        jobTitle: 'Chief Information Officer'
      },
      {
        firstName: 'Themba',
        lastName: 'Zulu',
        saId: '8504075800085',
        email: 'themba.zulu@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'IT Support Manager'
      },
      {
        firstName: 'Zanele',
        lastName: 'Ndlovu',
        saId: '8606120800186',
        email: 'zanele.ndlovu@golder.co.za',
        role: 'user',
        title: 'Staff Member',
        jobTitle: 'Chief Operations Officer'
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

    // Add login hint toast
    toast.info("You can now login with either email addresses or SA ID numbers", {
      duration: 8000
    });

  } catch (error) {
    console.error("Error in creating organization:", error);
    toast.error("Failed to create organization. Check console for details.");
  }
};

// Function to create global admin
const createGlobalAdmin = async () => {
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
