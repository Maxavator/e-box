
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createOrganization } from "@/utils/organization/createOrganization";
import { faker } from "@faker-js/faker/locale/en_ZA";

/**
 * Creates a demo company with users and admin roles
 */
export const createDemoEnvironment = async () => {
  try {
    toast.info("Creating demo environment... This may take a moment.");
    
    // Create demo company
    const companyName = "Demo Company (Pty) Ltd";
    console.log(`Creating demo company: ${companyName}`);
    
    const orgData = await createOrganization(companyName, "democompany.co.za");
    if (!orgData) {
      toast.error("Failed to create demo company");
      return null;
    }
    
    console.log("Demo company created:", orgData);
    
    // Create users - company admin, global admin, and regular staff
    await createDemoUsers(orgData.id);
    
    toast.success("Demo environment created successfully");
    return orgData;
  } catch (error) {
    console.error("Error creating demo environment:", error);
    toast.error("Failed to create demo environment. Check console for details.");
    return null;
  }
};

const createDemoUsers = async (orgId: string) => {
  const users = generateDemoUsers(orgId);
  let successCount = 0;

  // Create company admin
  const companyAdmin = users.find(u => u.role === 'org_admin');
  if (companyAdmin) {
    const success = await createDemoUser(companyAdmin, orgId);
    if (success) {
      console.log(`Created company admin: ${companyAdmin.firstName} ${companyAdmin.lastName}`);
      successCount++;
    }
  }
  
  // Create global admin
  const globalAdmin = users.find(u => u.role === 'global_admin');
  if (globalAdmin) {
    const success = await createDemoUser(globalAdmin, orgId);
    if (success) {
      console.log(`Created global admin: ${globalAdmin.firstName} ${globalAdmin.lastName}`);
      successCount++;
    }
  }
  
  // Create regular staff users
  const regularUsers = users.filter(u => u.role === 'staff');
  for (const user of regularUsers) {
    const success = await createDemoUser(user, orgId);
    if (success) successCount++;
    
    // Add a brief delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`Created ${successCount} demo users successfully`);
  return successCount;
};

const createDemoUser = async (user: DemoUser, orgId: string) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: 'DemoPass2025!',
      options: {
        data: {
          first_name: user.firstName,
          last_name: user.lastName,
          sa_id: user.saId
        },
        emailRedirectTo: `${window.location.origin}/auth`,
      }
    });

    if (authError) {
      console.error(`Failed to create demo user ${user.email}:`, authError);
      return false;
    }

    if (!authData.user) {
      console.error(`No user returned for ${user.email}`);
      return false;
    }

    console.log(`Created auth user with ID: ${authData.user.id} for ${user.email}`);

    // Wait for a moment to ensure the auth user trigger has time to create the profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update profile with organization_id and job_title
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: user.firstName,
        last_name: user.lastName,
        organization_id: orgId,
        job_title: user.jobTitle,
        sa_id: user.saId
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error(`Failed to update profile for ${user.email}:`, profileError);
      return false;
    }

    // Assign role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: authData.user.id,
        role: user.role
      });

    if (roleError) {
      console.error(`Failed to assign role to ${user.email}:`, roleError);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error creating demo user ${user.email}:`, error);
    return false;
  }
};

interface DemoUser {
  firstName: string;
  lastName: string;
  email: string;
  saId: string;
  jobTitle: string;
  role: 'global_admin' | 'org_admin' | 'staff';
}

const generateDemoUsers = (orgId: string): DemoUser[] => {
  // Set seed for reproducible results
  faker.seed(42);
  
  const users: DemoUser[] = [];
  
  // Generate company admin
  users.push({
    firstName: "Thabo",
    lastName: "Nkosi",
    email: "thabo.nkosi@democompany.co.za",
    saId: "7810205441087",
    jobTitle: "Company Administrator",
    role: 'org_admin'
  });
  
  // Generate global admin
  users.push({
    firstName: "Sarah",
    lastName: "van Wyk",
    email: "sarah.vanwyk@democompany.co.za",
    saId: "8905115811087", 
    jobTitle: "CIO",
    role: 'global_admin'
  });
  
  // Generate 10 regular staff members
  const jobTitles = [
    "Software Developer", 
    "Marketing Specialist", 
    "Sales Representative",
    "HR Officer",
    "Financial Analyst",
    "Customer Support Specialist",
    "Operations Manager",
    "Project Manager",
    "Business Analyst",
    "Product Designer"
  ];
  
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.helpers.slugify(`${firstName}.${lastName}@democompany.co.za`).toLowerCase();
    
    // Generate a valid South African ID number
    const year = String(Math.floor(Math.random() * 99)).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    const saId = `${year}${month}${day}${sequence}0880`;
    
    users.push({
      firstName,
      lastName,
      email,
      saId,
      jobTitle: jobTitles[i % jobTitles.length],
      role: 'staff'
    });
  }
  
  return users;
};
