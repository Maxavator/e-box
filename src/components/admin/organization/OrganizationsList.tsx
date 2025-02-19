
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { OrganizationTable } from "./OrganizationTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Organization } from "../types";

export const OrganizationsList = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userOrgId, setUserOrgId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required");
        return;
      }

      // Get user's role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        toast.error("Failed to fetch user role");
        return;
      }

      // Get user's organization
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error("Failed to fetch user profile");
        return;
      }

      setUserRole(roleData?.role || null);
      setUserOrgId(profileData?.organization_id || null);
    };

    fetchUserInfo();
  }, []);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations', userRole, userOrgId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // The RLS policies will automatically filter the results based on the user's role
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching organizations:', error);
        toast.error("Failed to fetch organizations");
        throw error;
      }

      return data as Organization[];
    },
    enabled: userRole !== null, // Only run query when we have the user role
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Organizations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrganizationTable 
          organizations={organizations} 
          isLoading={isLoading} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      </CardContent>
    </Card>
  );
};
