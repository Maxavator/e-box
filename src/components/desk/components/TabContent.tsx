
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Scroll } from "lucide-react";
import { Documents } from "@/components/desk/Documents";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { Policies } from "@/components/desk/Policies";
import { useState } from "react";

export function TabContent() {
  const [activeTab, setActiveTab] = useState("documents");
  
  return (
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
  );
}
