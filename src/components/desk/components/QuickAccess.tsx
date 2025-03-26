
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Scroll, FileStack, ArrowRight, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function QuickAccess() {
  const navigate = useNavigate();
  
  return (
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
  );
}
