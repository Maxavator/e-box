
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Building2, Settings, UserPlus, Shield,
  MessagesSquare, ArrowUpRight, LogOut, BarChart, 
  Bell, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: isGlobalAdmin, error } = await supabase.rpc('is_global_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast.error("Failed to verify admin status");
        navigate("/");
        return;
      }

      if (!isGlobalAdmin) {
        toast.error("Access denied: Admin privileges required");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdminStatus();
  }, [navigate]);

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
        return <DashboardView />;
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything until admin status is confirmed
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your system and monitor key metrics</p>
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

        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  <UserPlus className="w-4 h-4 text-primary" />
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

              <Card className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Organizations</CardTitle>
                  <Building2 className="w-4 h-4 text-primary" />
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

              <Card className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">System Health</CardTitle>
                  <Shield className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      0.1%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days uptime</p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Sessions</CardTitle>
                  <BarChart className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">1,284</div>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      15%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current active users</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-700">Failed Login Attempts</h4>
                        <p className="text-sm text-red-600">Multiple failed login attempts detected from IP 192.168.1.1</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Bell className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-700">System Update Required</h4>
                        <p className="text-sm text-yellow-600">New security patches available for installation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Audit
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      View System Alerts
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart className="w-4 h-4 mr-2" />
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              activeView === 'users' ? 'border-primary' : ''
            }`}
            onClick={() => setActiveView('users')}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
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
                <Building2 className="w-5 h-5 text-primary" />
                <span>Organizations</span>
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
                <Settings className="w-5 h-5 text-primary" />
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
