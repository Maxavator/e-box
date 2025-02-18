
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Building2, Settings, UserPlus, 
  MessagesSquare, ArrowUpRight, LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');

  const handleLogout = () => {
    navigate("/");
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
    <div className="flex-1 min-h-screen bg-gray-50">
      <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500">Manage your enterprise system</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="p-8">
        {activeView === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
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

            <Card>
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

            <Card>
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

            <Card>
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
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              activeView === 'users' ? 'border-primary' : ''
            }`}
            onClick={() => setActiveView('users')}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-brand-600" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Add, remove, and manage user access and permissions</p>
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              activeView === 'organizations' ? 'border-primary' : ''
            }`}
            onClick={() => setActiveView('organizations')}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <span>Organizations Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Manage organization settings and administrators</p>
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              activeView === 'settings' ? 'border-primary' : ''
            }`}
            onClick={() => setActiveView('settings')}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-brand-600" />
                <span>System Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Configure system-wide settings and preferences</p>
            </CardContent>
          </Card>
        </div>

        {activeView !== 'dashboard' && (
          <div className="mt-8">
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('dashboard')}
              className="mb-4"
            >
              ← Back to Dashboard
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
