
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationProfile } from "./organization/OrganizationProfile";
import { OrganizationMembers } from "./organization/OrganizationMembers";
import { OrganizationPolicies } from "./organization/OrganizationPolicies";

export const OrganizationSettings = () => {
  const { data: organization } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (!profile?.organization_id) return null;

      const { data: org, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      if (error) throw error;
      return org;
    },
  });

  if (!organization) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No organization found.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Organization Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <OrganizationProfile organization={organization} />
        </TabsContent>

        <TabsContent value="members">
          <OrganizationMembers organizationId={organization.id} />
        </TabsContent>

        <TabsContent value="policies">
          <OrganizationPolicies organizationId={organization.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
