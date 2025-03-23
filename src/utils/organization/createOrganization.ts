
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Creates a new organization in the database
 * @param name Organization name
 * @param domain Organization domain
 * @returns The created organization object or null if creation failed
 */
export const createOrganization = async (name: string, domain: string) => {
  console.log(`Creating organization: ${name} with domain ${domain}...`);
  
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name,
      domain
    })
    .select()
    .single();

  if (orgError) {
    console.error("Failed to create organization:", orgError);
    toast.error("Failed to create organization: " + orgError.message);
    return null;
  }

  console.log("Organization created successfully:", orgData);
  toast.success("Organization created successfully");

  return orgData;
};
