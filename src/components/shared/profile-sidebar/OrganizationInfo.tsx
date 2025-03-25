
import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrganizationInfoProps {
  organizationId?: string;
}

export function OrganizationInfo({ organizationId }: OrganizationInfoProps) {
  const { data: organization, isLoading } = useQuery({
    queryKey: ['organization', organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      console.log('Fetching organization data for ID:', organizationId);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', organizationId!)
        .single();
      
      if (error) {
        console.error('Error fetching organization:', error);
        return null;
      }
      
      console.log('Organization data fetched:', data);
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

  if (!organization?.name) {
    console.log('No organization name found for ID:', organizationId);
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2">
      <Building2 className="h-3.5 w-3.5 text-primary" />
      <span className="text-sm">{organization.name}</span>
    </div>
  );
}
