
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, BarChart } from "lucide-react";
import { Policies } from "@/components/desk/Policies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const OrganizationDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ChatHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <div className="flex-1 space-y-6 bg-gray-50">
        <header className="p-8 pb-0">
          <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
          <p className="text-gray-500">Manage your organization's information and policies</p>
        </header>

        <Tabs defaultValue="overview" className="px-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-brand-600" />
                    <span>Team Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Manage your organization's members</p>
                  <Button variant="outline" className="w-full">
                    Manage Team
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-brand-600" />
                    <span>Chat Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Monitor chat activity and usage</p>
                  <Button variant="outline" className="w-full">
                    View Activity
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-brand-600" />
                    <span>Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">View organization analytics</p>
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
    </div>
  );
};

export default OrganizationDashboard;
