
import { MailOpen, Calendar, UserCheck, FileStack, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function FeatureCards() {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
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
  );
}
