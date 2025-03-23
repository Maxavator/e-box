
import { toast } from "sonner";
import { createGlobalAdmin } from "./admin/createGlobalAdmin";
import { createOrganization } from "./organization/createOrganization";
import { createOrganizationUsers } from "./organization/createOrganizationUsers";
import { golderUsers } from "./organization/golderUserDefinitions";

/**
 * Creates the Golder organization with all users and the global admin
 */
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
    const orgData = await createOrganization('Golder (Pty) Ltd.', 'golder.co.za');
    if (!orgData) {
      return;
    }

    const orgId = orgData.id;

    // Step 2: Create users
    console.log("Creating users for Golder organization...");
    const { successCount, errorCount } = await createOrganizationUsers(golderUsers, orgId);
    
    if (successCount === golderUsers.length) {
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
