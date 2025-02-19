
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { OrganizationsList } from "@/components/admin/organization/OrganizationsList";
import { AppHeader } from "@/components/shared/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { Policies } from "@/components/desk/Policies";
import { DashboardHeader } from "@/components/organization/DashboardHeader";
import { OrganizationDetailsCard } from "@/components/organization/OrganizationDetailsCard";
import { OverviewCards } from "@/components/organization/OverviewCards";
import { Separator } from "@/components/ui/separator";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ 
    orgName: string; 
    isAdmin: boolean;
    orgDetails: {
      name: string;
      domain?: string;
      logo_url?: string;
      created_at: string;
      updated_at: string;
    } | null;
  }>({ 
    orgName: '', 
    isAdmin: false,
    orgDetails: null
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organizations(name, domain, logo_url, created_at, updated_at)')
          .eq('id', user.id)
          .single();

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          const orgName = profileData.organizations?.name || '';
          const isAdmin = roleData?.role === 'org_admin' || roleData?.role === 'global_admin';
          setUserInfo({ 
            orgName, 
            isAdmin,
            orgDetails: profileData.organizations
          });
        }
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
