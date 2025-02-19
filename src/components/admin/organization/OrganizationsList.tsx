
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { OrganizationTable } from "./OrganizationTable";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    profiles: number;
  };
}

export const OrganizationsList = () => {
  const { data: organizations, isLoading, error, refetch } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      // First, check if user has admin access
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (roleError) {
        console.error('Error checking user role:', roleError);
        throw new Error('Failed to verify access permissions');
      }

      const isAdmin = roleData?.role === 'global_admin' || roleData?.role === 'org_admin';

      // Fetch organizations with member count
      const { data, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          domain,
          logo_url,
          created_at,
          updated_at,
          profiles:profiles(count)
        `)
        .order('name');

      if (orgsError) {
        console.error('Error fetching organizations:', orgsError);
        toast.error('Failed to fetch organizations');
        throw orgsError;
      }

      // Transform the data to include member count
      return data.map(org => ({
        ...org,
        _count: {
          profiles: org.profiles?.[0]?.count || 0
        }
      })) as Organization[];
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Add an isAdmin state based on user role
  const { data: roleData } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAdmin: false };

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) return { isAdmin: false };
      return { isAdmin: data?.role === 'global_admin' || data?.role === 'org_admin' };
    }
  });

  const handleRetry = () => {
    refetch();
    toast.info('Retrying to fetch organizations...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Organizations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="space-y-4">
            <div className="text-destructive">
              Failed to load organizations. Please try again later.
            </div>
            <button 
              onClick={handleRetry}
              className="text-sm text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <OrganizationTable 
            organizations={organizations || []} 
            isLoading={isLoading} 
            onEdit={() => {}} 
            onDelete={() => {}} 
            isAdmin={roleData?.isAdmin ?? false}
          />
        )}
      </CardContent>
    </Card>
  );
};
