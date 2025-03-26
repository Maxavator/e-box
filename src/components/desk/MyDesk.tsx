import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Documents } from "./Documents";
import { LeaveManager } from "./LeaveManager";
import { Policies } from "./Policies";
import { 
  Briefcase, FileText, Clock, Scroll, Inbox, Calendar, 
  Users, FileStack, AlertCircle, MailOpen, UserCheck, 
  ArrowRight, ExternalLink
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => navigate("/documents")}
        >
          <FileText className="h-4 w-4" />
          <span>Open My Documents</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/desk/leave")}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={handleDismissNotice}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Inbox</CardTitle>
              </div>
              <Badge className="bg-blue-500">2 New</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Access your messages and notifications</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={() => handleNavigation("/desk/inbox")}
            >
              <span>Open Inbox</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Calendar</CardTitle>
              </div>
              <Badge className="bg-green-500">1 Event</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">View your schedule and upcoming events</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={() => navigate("/calendar")}
            >
              <span>Open Calendar</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Colleagues</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">View your team and organization contacts</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={() => handleNavigation("/desk/colleagues")}
            >
              <span>View Colleagues</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileStack className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Payslip</CardTitle>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-600">New</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Access your latest payslips and tax documents</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={() => handleNavigation("/desk/payslip")}
            >
              <span>View Payslips</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
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
                  className="w-full justify-between" 
                  onClick={() => navigate("/documents")}
                >
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Documents</span>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate("/desk/leave")}
                >
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Leave Management</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate("/desk/policies")}
                >
                  <div className="flex items-center">
                    <Scroll className="mr-2 h-4 w-4" />
                    <span>Company Policies</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Separator className="my-2" />
                <Button 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate("/desk/payslip")}
                >
                  <div className="flex items-center">
                    <FileStack className="mr-2 h-4 w-4" />
                    <span>Payslip</span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-600">New</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Desk Features</CardTitle>
          <CardDescription>Explore all available desk features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              onClick={() => navigate("/desk/documents")}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Documents</span>
              <span className="text-xs text-muted-foreground mt-1">Access and manage files</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              onClick={() => navigate("/desk/leave")}
            >
              <Clock className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Leave Management</span>
              <span className="text-xs text-muted-foreground mt-1">Request and track time off</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              onClick={() => navigate("/desk/policies")}
            >
              <Scroll className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Policies</span>
              <span className="text-xs text-muted-foreground mt-1">View company guidelines</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              onClick={() => navigate("/desk/inbox")}
            >
              <MailOpen className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Inbox</span>
              <span className="text-xs text-muted-foreground mt-1">Manage communications</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              onClick={() => navigate("/calendar")}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Calendar</span>
              <span className="text-xs text-muted-foreground mt-1">View your schedule</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              onClick={() => navigate("/desk/payslip")}
            >
              <FileStack className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Payslip</span>
              <span className="text-xs text-muted-foreground mt-1">Access financial documents</span>
              <Badge variant="outline" className="mt-1 border-green-500 text-green-600">New</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Desk Documents</span>
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
