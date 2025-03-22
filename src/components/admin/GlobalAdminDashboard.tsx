
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "./UserManagement";
import OrganizationManagement from "./OrganizationManagement";
import { SystemSettings } from "./SystemSettings";
import { AdminUsersList } from "./AdminUsersList";
import { useNavigate } from "react-router-dom";
import { Building2, Settings, Shield, Users } from "lucide-react";

export const GlobalAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Global Admin Portal</h1>
        <p className="text-muted-foreground">
          Manage all users, organizations, and administrator accounts across the platform
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="administrators">Administrators</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setActiveTab("administrators")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage platform and organization administrators</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setActiveTab("organizations")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View and manage all organizations</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setActiveTab("users")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View and manage all platform users</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setActiveTab("settings")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configure global platform settings</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Summary of key platform metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Organizations</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Admin Users</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="administrators" className="mt-6">
          <AdminUsersList />
        </TabsContent>

        <TabsContent value="organizations" className="mt-6">
          <OrganizationManagement />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
