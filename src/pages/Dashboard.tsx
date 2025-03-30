
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";

// Component imports
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { recentTasks } from "@/components/dashboard/data";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading: roleLoading } = useUserRole();
  const [lastUpdate, setLastUpdate] = useState("Just now");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { checkAuth, AuthDialog } = useAuthDialog();
  const { userDisplayName, userJobTitle, organizationName, loading: profileLoading } = useUserProfile();

  const handleQuickAction = (action: string) => {
    console.log(`Quick action clicked: ${action}`);
    switch (action) {
      case 'documents':
        navigate('/mydesk');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'messages':
        navigate('/chat');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        toast.info(`${action} feature coming soon`);
        break;
    }
  };

  const refreshData = () => {
    setIsDataLoading(true);
    
    setTimeout(() => {
      setLastUpdate("Just now");
      setIsDataLoading(false);
      toast.success("Dashboard data refreshed");
    }, 800);
  };

  useEffect(() => {
    console.log("Dashboard - Current user data:", {
      userDisplayName, 
      userJobTitle, 
      organizationName
    });
  }, [userDisplayName, userJobTitle, organizationName]);

  if (roleLoading || profileLoading) {
    return <LoadingState />;
  }

  if (userRole === 'staff') {
    console.log("Staff user detected, redirecting to chat");
    navigate('/chat');
    return null;
  }

  // Format name for display
  const formattedName = userDisplayName || 'User';

  return (
    <div className="flex-1 min-h-screen bg-background">
      <AuthDialog />
      <DashboardHeader 
        formattedName={formattedName}
        isAdmin={isAdmin}
        jobTitle={userJobTitle || undefined}
        organizationName={organizationName || undefined}
        lastUpdate={lastUpdate}
        isDataLoading={isDataLoading}
        refreshData={refreshData}
      />
      
      <DashboardContent 
        isAdmin={isAdmin} 
        navigate={navigate}
        handleQuickAction={handleQuickAction}
        recentTasks={recentTasks}
      />
    </div>
  );
};

export default Dashboard;
