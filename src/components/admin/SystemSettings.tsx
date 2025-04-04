
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createGlobalAdmin } from "@/utils/admin/createGlobalAdmin";
import { createDemoEnvironment } from "@/utils/admin/createDemoEnvironment";
import { useState } from "react";
import { Loader2, UserPlus, Settings, Shield, Building } from "lucide-react";
import { SetGlobalAdminForm } from "./SetGlobalAdminForm";
import { Separator } from "@/components/ui/separator";
import { GlobalAdminsList } from "./GlobalAdminsList";

export function SystemSettings() {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const handleCreateGlobalAdmin = async () => {
    setIsCreating(true);
    try {
      await createGlobalAdmin();
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateDemoEnvironment = async () => {
    setIsCreatingDemo(true);
    try {
      await createDemoEnvironment();
    } finally {
      setIsCreatingDemo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">
          Configure system-wide settings and manage global administrators
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Create Test Global Admin
            </CardTitle>
            <CardDescription>
              Create a test global admin user with pre-configured credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm mb-4">
              This will create a standard test user with global administrator privileges that
              you can use for testing the system.
            </p>
            
            <Button 
              onClick={handleCreateGlobalAdmin} 
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Admin...
                </>
              ) : (
                "Create Global Admin"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              Create Demo Environment
            </CardTitle>
            <CardDescription>
              Set up a demo company with users and admin roles
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm mb-4">
              This will create a demo company with 10 staff users, a company admin, and a global admin,
              all with realistic South African details.
            </p>
            
            <Button 
              onClick={handleCreateDemoEnvironment} 
              disabled={isCreatingDemo}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCreatingDemo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Environment...
                </>
              ) : (
                "Create Demo Environment"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <SetGlobalAdminForm />
      </div>
      
      <Separator className="my-6" />
      
      <GlobalAdminsList />
      
      <Separator className="my-6" />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Additional system configuration options
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Advanced settings will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
