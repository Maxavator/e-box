
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { OrganizationsList } from "@/components/admin/organization/OrganizationsList";
import { AppHeader } from "@/components/shared/AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Policies } from "@/components/desk/Policies";
import { DashboardHeader } from "@/components/organization/DashboardHeader";
import { OrganizationDetailsCard } from "@/components/organization/OrganizationDetailsCard";
import { OverviewCards } from "@/components/organization/OverviewCards";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className={`w-full justify-start ${isMobile ? 'flex-wrap' : ''}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            {userInfo.isAdmin && (
              <TabsTrigger value="admin">Administration</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid-responsive gap-6">
              {userInfo.orgDetails && (
                <OrganizationDetailsCard orgDetails={userInfo.orgDetails} />
              )}
              <OverviewCards isAdmin={userInfo.isAdmin} />
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="mt-6">
            <OrganizationsList />
          </TabsContent>

          <TabsContent value="policies">
            <Policies />
          </TabsContent>

          {userInfo.isAdmin && (
            <TabsContent value="admin">
              <div className="space-y-6">
                <UserManagement />
                <OrganizationManagement />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default OrganizationDashboard;
