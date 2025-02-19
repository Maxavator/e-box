
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/shared/AppHeader";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";
import { LookupTools } from "@/components/admin/dashboard/LookupTools";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminPortal = () => {
  const navigate = useNavigate();

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

  const handleOrganizationManagement = () => {
    navigate("/admin/organization");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="container mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage your organization's settings and users
          </p>
        </div>

        <NavigationCards onOrganizationManagement={handleOrganizationManagement} />
        
        <div className="grid gap-8 md:grid-cols-2">
          <StatsCards />
          <LookupTools />
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
