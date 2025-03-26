
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { DeskHeader } from "./components/DeskHeader";
import { LeaveNotice } from "./components/LeaveNotice";
import { FeatureCards } from "./components/FeatureCards";
import { OrganizationUpdates } from "./components/OrganizationUpdates";
import { QuickAccess } from "./components/QuickAccess";
import { DeskFeatures } from "./components/DeskFeatures";
import { TabContent } from "./components/TabContent";

export function MyDesk() {
  const { organizationName, loading, error } = useUserProfile();
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
  
  const handleDismissNotice = () => {
    setMockLeaveNotice(false);
  };
  
  return (
    <div className="p-4 md:p-6">
      <DeskHeader />
      
      {mockLeaveNotice && <LeaveNotice onDismiss={handleDismissNotice} />}
      
      <FeatureCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <OrganizationUpdates organizationName={organizationName} />
        </div>
        
        <div className="lg:col-span-1">
          <QuickAccess />
        </div>
      </div>
      
      <DeskFeatures />
      
      <TabContent />
    </div>
  );
}
