
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { OrganizationsList } from "@/components/admin/organization/OrganizationsList";
import { AppHeader } from "@/components/shared/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { Policies } from "@/components/desk/Policies";
import { DashboardHeader } from "@/components/organization/DashboardHeader";
import { OrganizationDetailsCard } from "@/components/organization/OrganizationDetailsCard";
import { OverviewCards } from "@/components/organization/OverviewCards";
import { Separator } from "@/components/ui/separator";

interface OrganizationDetails {
  name: string;
  domain?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
}

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ 
    orgName: string; 
    isAdmin: boolean;
    orgDetails: OrganizationDetails | null;
  }>({ 
    orgName: '', 
    isAdmin: false,
    orgDetails: null
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch organization details
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (profileError || !profileData?.organization_id) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        // Get organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('name, domain, logo_url, created_at, updated_at')
          .eq('id', profileData.organization_id)
          .single();

        if (orgError || !orgData) {
          console.error('Error fetching organization:', orgError);
          return;
        }

        // Get user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError) {
          console.error('Error fetching role:', roleError);
          return;
        }

        const isAdmin = roleData?.role === 'org_admin' || roleData?.role === 'global_admin';
        
        setUserInfo({
          orgName: orgData.name || '',
          isAdmin,
          orgDetails: orgData
        });
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <main className="section-padding container-responsive">
        <DashboardHeader 
          orgName={userInfo.orgName}
          isAdmin={userInfo.isAdmin}
          onLogout={handleLogout}
          onManageOrg={() => navigate("/organization/manage")}
        />

        <div className="mt-8 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>
            <div className="grid-responsive gap-6">
              {userInfo.orgDetails && (
                <OrganizationDetailsCard orgDetails={userInfo.orgDetails} />
              )}
              <OverviewCards isAdmin={userInfo.isAdmin} />
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-6">Organizations</h2>
            <OrganizationsList />
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-6">Policies</h2>
            <Policies />
          </section>

          {userInfo.isAdmin && (
            <>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-6">Administration</h2>
                <div className="space-y-6">
                  <UserManagement />
                  <OrganizationManagement />
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboard;
