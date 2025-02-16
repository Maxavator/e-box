
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Settings, UserPlus, MessagesSquare, ArrowUpRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPortal = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
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
        {/* Statistics Section */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-brand-600" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Add, remove, and manage user access and permissions</p>
              <Button variant="outline" className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <span>Organizations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Manage organization settings and administrators</p>
              <Button variant="outline" className="w-full">
                Manage Organizations
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-brand-600" />
                <span>System Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Configure system-wide settings and preferences</p>
              <Button variant="outline" className="w-full">
                Configure Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
