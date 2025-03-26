
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Scroll, MailOpen, Calendar, FileStack } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function DeskFeatures() {
  const navigate = useNavigate();
  
  return (
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
  );
}
