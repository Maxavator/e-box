
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
}

export const OrganizationsList = () => {
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          domain,
          logo_url,
          created_at,
          updated_at
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Failed to fetch organizations');
        throw error;
      }

      return data as Organization[];
    },
  });

  if (error) {
    console.error('Error in organizations query:', error);
  }

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
          <div className="text-destructive">
            Failed to load organizations. Please try again later.
          </div>
        ) : (
          <OrganizationTable 
            organizations={organizations || []} 
            isLoading={isLoading} 
            onEdit={() => {}} 
            onDelete={() => {}} 
          />
        )}
      </CardContent>
    </Card>
  );
};
