
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGolderColleagues = () => {
  return useQuery({
    queryKey: ['golder-colleagues'],
    queryFn: async () => {
      try {
        // Get Golder organization ID first
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .ilike('name', '%golder%')
          .maybeSingle();
        
        if (orgError) throw orgError;
        if (!orgData?.id) {
          console.log("Golder organization not found");
          return [];
        }
        
        const golderOrgId = orgData.id;
        
        // Get all profiles from Golder organization
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, job_title')
          .eq('organization_id', golderOrgId);
        
        if (profilesError) throw profilesError;
        
        return profiles || [];
      } catch (error) {
        console.error("Error fetching Golder colleagues:", error);
        toast.error("Failed to load Golder colleagues");
        return [];
      }
    }
  });
};
