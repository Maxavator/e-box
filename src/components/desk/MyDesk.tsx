
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Documents } from "./Documents";
import { LeaveManager } from "./LeaveManager";
import { Policies } from "./Policies";
import { 
  Briefcase, FileText, Clock, Scroll, Inbox, Calendar, 
  Users, FileStack, AlertCircle, MailOpen, UserCheck 
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Sample announcements
const announcements = [
  {
    id: "1",
    title: "Company Outing Next Month",
    description: "Join us for a team building event on May 20. RSVP by April 30.",
    date: "2 days ago",
    priority: "medium"
  },
  {
    id: "2",
    title: "New Expense System Rollout",
    description: "Training sessions will be held next week for the new expense management system.",
    date: "1 week ago",
    priority: "high"
  }
];

export function MyDesk() {
  const [activeTab, setActiveTab] = useState("documents");
  const { organizationName, loading, error } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mockLeaveNotice, setMockLeaveNotice] = useState(true);
  
  // Demo effect - mock pending tasks notification
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mockLeaveNotice) {
        toast({
          title: "Leave Request Updated",
          description: "Your leave request has been approved by management.",
          variant: "default",
        });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toast, mockLeaveNotice]);
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const handleDismissNotice = () => {
    setMockLeaveNotice(false);
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
          <Button 
            variant={activeTab === "documents" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveTab("documents")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button 
            variant={activeTab === "leave" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveTab("leave")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Leave
          </Button>
          <Button 
            variant={activeTab === "policies" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveTab("policies")}
          >
            <Scroll className="mr-2 h-4 w-4" />
            Policies
          </Button>
        </div>
      </div>
      
      {mockLeaveNotice && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Leave Request Approved</h3>
                <p className="text-sm text-green-700">Your request for April 15-18 has been approved by management.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDismissNotice}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4 hover:bg-primary/5" 
          onClick={() => handleNavigation("/desk/inbox")}
        >
          <MailOpen className="h-8 w-8 mb-2 text-primary" />
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
          <UserCheck className="h-8 w-8 mb-2 text-amber-600" />
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Organization Updates</CardTitle>
              <CardDescription>Latest updates from {organizationName || 'your organization'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizationName ? (
                  <>
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className={`p-4 rounded-lg border ${
                        announcement.priority === 'high' ? 'bg-red-50 border-red-200' : 
                        announcement.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' : 
                        'bg-primary/5'
                      }`}>
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium">{announcement.title}</h3>
                          <Badge variant={
                            announcement.priority === 'high' ? 'destructive' : 
                            announcement.priority === 'medium' ? 'default' : 
                            'outline'
                          }>
                            {announcement.priority === 'high' ? 'Important' : 
                             announcement.priority === 'medium' ? 'Announcement' : 
                             'Information'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.description}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          Posted: {announcement.date}
                        </div>
                      </div>
                    ))}
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
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Frequently used tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/desk/documents")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  My Documents
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/desk/leave")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Leave Management
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/desk/policies")}
                >
                  <Scroll className="mr-2 h-4 w-4" />
                  Company Policies
                </Button>
                <Separator className="my-2" />
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/desk/payslip")}
                >
                  <FileStack className="mr-2 h-4 w-4" />
                  Payslip
                  <Badge className="ml-auto" variant="success">New</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
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
