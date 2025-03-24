
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ModerationDashboard } from "./ModerationDashboard";
import { ContentQueue } from "./ContentQueue";
import { UserReports } from "./UserReports";
import { ModerationSettings } from "./ModerationSettings";
import { ModerationHistory } from "./ModerationHistory";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export function Moderation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { isAdmin, userRole, isLoading } = useUserRole();
  
  // Check if user has moderation privileges
  const isModerator = 
    userRole === 'hr_moderator' || 
    userRole === 'comm_moderator' || 
    userRole === 'stakeholder_moderator';
  
  const hasAccess = isAdmin || isModerator;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
          <div className="h-3 w-24 bg-muted-foreground/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the moderation portal. This page requires moderator or admin privileges.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">Moderation Portal</h1>
            <p className="text-muted-foreground">
              {userRole === 'hr_moderator' ? 'Manage HR content and user requests' : 
               userRole === 'comm_moderator' ? 'Manage communication content and broadcasts' :
               userRole === 'stakeholder_moderator' ? 'Manage stakeholder communications and public content' :
               'Manage all content across the platform'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="queue">Content Queue</TabsTrigger>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="p-0">
          <ModerationDashboard userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="queue" className="p-0">
          <ContentQueue userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="reports" className="p-0">
          <UserReports userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="history" className="p-0">
          <ModerationHistory userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="settings" className="p-0">
          <ModerationSettings userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
