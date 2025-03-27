import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrganizationInfoProps {
  organizationId?: string;
  organizationName?: string;
  logo?: string;
}

export function OrganizationInfo({ organizationId, organizationName, logo }: OrganizationInfoProps) {
  if (organizationName) {
    return (
      <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2">
        <Building2 className="h-3.5 w-3.5 text-primary" />
        <span className="text-sm">{organizationName}</span>
      </div>
    );
  }

  const { data: organization, isLoading } = useQuery({
    queryKey: ['sidebar-organization-info', organizationId],
    enabled: !!organizationId && !organizationName,
    queryFn: async () => {
      console.log('Fetching organization info for ID:', organizationId);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', organizationId!)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching organization info:', error);
        return null;
      }
      
      console.log('Organization info data fetched:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2">
        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Loading organization...</span>
      </div>
    );
  }

  if (!organization?.name && !organizationName) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2">
      <Building2 className="h-3.5 w-3.5 text-primary" />
      <span className="text-sm">{organization?.name}</span>
    </div>
  );
}
