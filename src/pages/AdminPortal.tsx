
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";
import { Dashboard } from "@/components/admin/dashboard/Dashboard";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
  };

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'organizations':
        return <OrganizationManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {activeView !== 'dashboard' && (
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="mb-4 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        
        {renderView()}
      </div>
    </div>
  );
};

export default AdminPortal;
