
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import type { Organization } from "../types";

export const useOrganizations = (isAdmin: boolean | undefined, userRole: string | undefined) => {
  const { 
    data: userProfile, 
    isLoading: isProfileLoading,
    error: profileError 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: userRole === 'org_admin',
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching user profile:', error);
        toast.error("Failed to fetch user profile");
      }
    }
  });

  const { 
    data: organizations,
    isLoading: isOrgsLoading,
    error: orgsError
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to view organizations");
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Organization[];
    },
    enabled: isAdmin || userRole === 'org_admin',
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching organizations:', error);
        toast.error("Failed to fetch organizations");
      }
    }
  });

  const isLoading = isProfileLoading || isOrgsLoading;
  const error = profileError || orgsError;

  return { organizations, userProfile, isLoading, error };
};
