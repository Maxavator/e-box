
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Documents } from "./Documents";
import { LeaveManager } from "./LeaveManager";
import { Policies } from "./Policies";
import { Briefcase, FileText, Clock, Scroll, Inbox, Calendar, Users, FileStack } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MyDesk() {
  const [activeTab, setActiveTab] = useState("documents");
  const { organizationName, loading } = useUserProfile();
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Desk {!loading && organizationName ? `@${organizationName}` : ''}</h1>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4" 
          onClick={() => handleNavigation("/desk/inbox")}
        >
          <Inbox className="h-8 w-8 mb-2" />
          <span>Inbox</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4" 
          onClick={() => handleNavigation("/desk/calendar")}
        >
          <Calendar className="h-8 w-8 mb-2" />
          <span>Calendar</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4" 
          onClick={() => handleNavigation("/desk/colleagues")}
        >
          <Users className="h-8 w-8 mb-2" />
          <span>Colleagues</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-28 p-4" 
          onClick={() => handleNavigation("/desk/payslip")}
        >
          <FileStack className="h-8 w-8 mb-2" />
          <span>Payslip</span>
        </Button>
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
