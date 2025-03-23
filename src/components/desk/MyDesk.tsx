
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Documents } from "./Documents";
import { LeaveManager } from "./LeaveManager";
import { Policies } from "./Policies";
import { Briefcase, FileText, Clock, Scroll } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

export function MyDesk() {
  const [activeTab, setActiveTab] = useState("documents");
  const { organizationName } = useUserProfile();
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">My Desk {organizationName ? `@${organizationName}` : ''}</h1>
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
