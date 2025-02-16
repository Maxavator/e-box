
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Settings } from "lucide-react";

const AdminPortal = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
        <p className="text-gray-500">Manage your enterprise messaging system</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-brand-600" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">Add, remove, and manage user access</p>
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
            <p className="text-gray-500 mb-4">Manage organization settings and admins</p>
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
            <p className="text-gray-500 mb-4">Configure system-wide settings</p>
            <Button variant="outline" className="w-full">
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortal;
