
import { OrganizationManagement as OrganizationManagementComponent } from "@/components/admin/OrganizationManagement";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const OrganizationManagement = () => {
  const navigate = useNavigate();

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
      <main className="container mx-auto p-4 space-y-6">
        <OrganizationManagementComponent />
      </main>
    </div>
  );
};

export default OrganizationManagement;
