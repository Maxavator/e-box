import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrganizationInfoProps {
  organizationId?: string | null;
  organizationName?: string | null;
  logo?: string;
}

export function OrganizationInfo({ organizationId, organizationName, logo }: OrganizationInfoProps) {
  // If organization name is directly provided, display it without querying
  if (organizationName) {
    console.log('Rendering OrganizationInfo with provided name:', organizationName);
    return (
      <div className="flex items-center gap-2 px-1 py-1.5">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Organization</span>
          <span className="text-sm font-medium">{organizationName}</span>
        </div>
      </div>
    );
  }

  // Otherwise, fetch organization info using the ID
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
      <div className="flex items-center gap-2 px-1 py-1.5 animate-pulse">
        <div className="bg-muted p-1.5 rounded-md">
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <div className="h-3 w-16 bg-muted rounded"></div>
          <div className="h-4 w-24 bg-muted rounded mt-1"></div>
        </div>
      </div>
    );
  }

  if (!organization?.name && !organizationName) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-1 py-1.5">
      <div className="bg-primary/10 p-1.5 rounded-md">
        <Building2 className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Organization</span>
        <span className="text-sm font-medium">{organization?.name}</span>
      </div>
    </div>
  );
}
