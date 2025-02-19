
import { Button } from "@/components/ui/button";
import { LogOut, Users, Building2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { LookupTools } from "@/components/admin/dashboard/LookupTools";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
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
        return (
          <div className="space-y-8">
            <StatsCards />
            <LookupTools />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-gray-100"
                onClick={() => setActiveView('users')}
              >
                <Users className="h-8 w-8" />
                <span>User Management</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-gray-100"
                onClick={() => setActiveView('organizations')}
              >
                <Building2 className="h-8 w-8" />
                <span>Organization Management</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-gray-100"
                onClick={() => setActiveView('settings')}
              >
                <Settings className="h-8 w-8" />
                <span>System Settings</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeView === 'dashboard' ? 'Admin Dashboard' : 
               activeView === 'users' ? 'User Management' :
               activeView === 'organizations' ? 'Organization Management' : 
               'System Settings'}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeView === 'dashboard' ? 'Overview of your admin portal' :
               activeView === 'users' ? 'Manage user accounts and permissions' :
               activeView === 'organizations' ? 'Manage organizations and their settings' :
               'Configure system-wide settings'}
            </p>
          </div>
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
            onClick={() => setActiveView('dashboard')}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
        )}

        {renderView()}
      </div>
    </div>
  );
};

export default AdminPortal;
