
import { AppHeader } from "@/components/shared/AppHeader";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupManagement } from "@/components/admin/organization/GroupManagement";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Building, Users } from "lucide-react";

const OrganizationManagementPage = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole } = useUserRole();
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleLogoClick = () => {
    navigate("/admin");
  };

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
        <main className="container mx-auto p-8">
          <div className="bg-red-50 text-red-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p>Only administrators can access organization management features.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="container mx-auto p-8">
        <Tabs defaultValue="organizations">
          <TabsList className="mb-6">
            <TabsTrigger value="organizations" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="organizations">
            <OrganizationManagement />
          </TabsContent>
          
          <TabsContent value="groups">
            <GroupManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OrganizationManagementPage;
