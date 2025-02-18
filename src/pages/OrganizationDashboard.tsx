
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, BarChart, Building2 } from "lucide-react";
import { Policies } from "@/components/desk/Policies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ userName: string; orgName: string }>({ userName: '', orgName: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, organizations(name)')
          .eq('id', user.id)
          .single();

        if (profileData) {
          const userName = `${profileData.first_name} ${profileData.last_name}`;
          const orgName = profileData.organizations?.name || '';
          setUserInfo({ userName, orgName });
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  return (
    <div className="min-h-screen bg-background">
      <ChatHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="w-full px-4 py-6 space-y-6">
        <div className="max-w-[2000px] mx-auto">
          <header className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">Organization Dashboard</h1>
              {userInfo.userName && (
                <p className="text-muted-foreground">
                  {userInfo.userName} ({userInfo.orgName})
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Manage your organization's information and policies</p>
              <Button 
                variant="outline"
                onClick={() => navigate("/organization/manage")}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Manage Organization
              </Button>
            </div>
          </header>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Team Members</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Manage your organization's members</p>
                    <Button variant="outline" className="w-full">
                      Manage Team
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span>Chat Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Monitor chat activity and usage</p>
                    <Button variant="outline" className="w-full">
                      View Activity
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      <span>Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">View organization analytics</p>
                    <Button variant="outline" className="w-full">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="policies">
              <Policies />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboard;
