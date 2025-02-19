
import { AppHeader } from "@/components/shared/AppHeader";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OrganizationManagementPage = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="container mx-auto p-8">
        <OrganizationManagement />
      </main>
    </div>
  );
};

export default OrganizationManagementPage;
