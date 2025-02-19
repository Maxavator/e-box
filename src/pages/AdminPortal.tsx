
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Building2, Settings, UserPlus, 
  MessagesSquare, ArrowUpRight, LogOut,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";

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
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
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

        {activeView === 'dashboard' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  <UserPlus className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">2,834</div>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      12%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+180 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Organizations</CardTitle>
                  <Building2 className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">147</div>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      8%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+12 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Messages Sent</CardTitle>
                  <MessagesSquare className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">92.5k</div>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      24%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+15.2k this month</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">System Uptime</CardTitle>
                  <Settings className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      0.2%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveView('users')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="w-5 h-5 text-primary" />
                    <span>User Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Add, remove, and manage user access and permissions</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveView('organizations')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span>Organizations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Manage organization settings and administrators</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveView('settings')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Settings className="w-5 h-5 text-primary" />
                    <span>System Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Configure system-wide settings and preferences</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToDashboard}
              className="mb-4 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            {renderView()}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardView = () => null;

export default AdminPortal;
