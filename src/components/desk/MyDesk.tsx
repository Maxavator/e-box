
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Documents } from "./Documents";
import { LeaveManager } from "./LeaveManager";
import { Policies } from "./Policies";
import { Briefcase, FileText, Clock, Scroll, Inbox, Calendar, Users, FileStack, AlertCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MyDesk() {
  const [activeTab, setActiveTab] = useState("documents");
  const { organizationName, loading, error } = useUserProfile();
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold leading-tight">Desk {!loading && organizationName ? `@${organizationName}` : ''}</h1>
            {!loading && organizationName && (
              <p className="text-sm text-muted-foreground">Your organizational workspace</p>
            )}
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Error loading organization information</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("documents")}>
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("leave")}>
            <Clock className="mr-2 h-4 w-4" />
            Leave
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("policies")}>
            <Scroll className="mr-2 h-4 w-4" />
            Policies
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4 hover:bg-primary/5" 
          onClick={() => handleNavigation("/desk/inbox")}
        >
          <Inbox className="h-8 w-8 mb-2 text-primary" />
          <span className="font-medium">Inbox</span>
          <span className="text-xs text-muted-foreground">View messages</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4 hover:bg-green-50" 
          onClick={() => handleNavigation("/desk/calendar")}
        >
          <Calendar className="h-8 w-8 mb-2 text-green-600" />
          <span className="font-medium">Calendar</span>
          <span className="text-xs text-muted-foreground">View schedule</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4 hover:bg-amber-50" 
          onClick={() => handleNavigation("/desk/colleagues")}
        >
          <Users className="h-8 w-8 mb-2 text-amber-600" />
          <span className="font-medium">Colleagues</span>
          <span className="text-xs text-muted-foreground">View team members</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4 hover:bg-blue-50" 
          onClick={() => handleNavigation("/desk/payslip")}
        >
          <FileStack className="h-8 w-8 mb-2 text-blue-600" />
          <span className="font-medium">Payslip</span>
          <Badge variant="outline" className="mt-1">New</Badge>
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Organization Updates</CardTitle>
          <CardDescription>Latest updates from {organizationName || 'your organization'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizationName ? (
              <>
                <div className="p-4 rounded-lg border bg-primary/5">
                  <h3 className="font-medium">Welcome to your organizational workspace</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access all your documents, leave requests, and organizational policies in one place.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-green-50">
                  <h3 className="font-medium text-green-700">New Document Verification System</h3>
                  <p className="text-sm text-green-600/80 mt-1">
                    All documents are now digitally signed and verified for authenticity.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-lg border bg-muted">
                <h3 className="font-medium">Connect to an organization</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Join an organization to see updates and access shared resources.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Leave Manager</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            <span>Policies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-0">
          <div className="p-0">
            <Documents />
          </div>
        </TabsContent>
        
        <TabsContent value="leave" className="mt-0">
          <div className="p-0">
            <LeaveManager />
          </div>
        </TabsContent>
        
        <TabsContent value="policies" className="mt-0">
          <div className="p-0">
            <Policies />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
