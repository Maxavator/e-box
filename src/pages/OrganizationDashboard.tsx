
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, BarChart, Building2, Shield, LogOut } from "lucide-react";
import { Policies } from "@/components/desk/Policies";
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

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ orgName: string; isAdmin: boolean }>({ 
    orgName: '', 
    isAdmin: false 
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organizations(name)')
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
          setUserInfo({ orgName, isAdmin });
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
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <h1 className="heading-responsive font-bold tracking-tight">Organization Dashboard</h1>
            <div className="flex items-center gap-4">
              {userInfo.orgName && (
                <p className="text-muted-foreground text-responsive">
                  {userInfo.orgName}
                  {userInfo.isAdmin && <span className="ml-2 text-primary">(Admin)</span>}
                </p>
              )}
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-muted-foreground text-responsive">
              Manage your organization's information and policies
            </p>
            {userInfo.isAdmin && (
              <Button 
                variant="outline"
                onClick={() => navigate("/organization/manage")}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <Building2 className="h-4 w-4" />
                Manage Organization
              </Button>
            )}
          </div>
        </header>

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
            <div className="grid-responsive">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-responsive">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Team Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-responsive">
                    Manage your organization's members
                  </p>
                  <Button variant="outline" className="w-full">
                    Manage Team
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-responsive">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Chat Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-responsive">
                    Monitor chat activity and usage
                  </p>
                  <Button variant="outline" className="w-full">
                    View Activity
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-responsive">
                    <BarChart className="h-5 w-5 text-primary" />
                    <span>Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-responsive">
                    View organization analytics
                  </p>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {userInfo.isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-responsive">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Role Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-responsive">
                      Manage user roles and permissions
                    </p>
                    <Button variant="outline" className="w-full">
                      Manage Roles
                    </Button>
                  </CardContent>
                </Card>
              )}
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
