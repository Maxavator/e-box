
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { toast } from "sonner";

// Component imports
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { recentTasks } from "@/components/dashboard/data";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading } = useUserRole();
  const [lastUpdate, setLastUpdate] = useState("Just now");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { checkAuth, AuthDialog } = useAuthDialog();

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

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['dashboardProfile'],
    queryFn: async () => {
      console.log("Fetching user profile data for dashboard...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching auth user:", userError);
        return null;
      }
      
      if (user) {
        console.log("Auth user found:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, job_title, organization_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
          return null;
        }
        
        console.log("Dashboard - Profile data retrieved:", data);
        return data;
      }
      
      console.log("No authenticated user found");
      return null;
    },
  });

  const { data: organization } = useQuery({
    queryKey: ['dashboardOrganization', profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      console.log("Fetching organization data for dashboard...");
      const { data, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', profile!.organization_id)
        .single();
      
      if (error) {
        console.error("Error fetching organization data:", error);
        return null;
      }
      
      console.log("Organization data retrieved:", data);
      return data;
    },
  });

  const formattedName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
    "User";
    
  const jobTitle = profile?.job_title || '';

  const refreshData = () => {
    setIsDataLoading(true);
    
    setTimeout(() => {
      setLastUpdate("Just now");
      setIsDataLoading(false);
      toast.success("Dashboard data refreshed");
    }, 800);
  };

  useEffect(() => {
    console.log("Dashboard - Current profile data:", profile);
    console.log("Dashboard - Organization data:", organization);
  }, [profile, organization]);

  if (isLoading || isProfileLoading) {
    return <LoadingState />;
  }

  if (userRole === 'staff') {
    console.log("Staff user detected, redirecting to chat");
    navigate('/chat');
    return null;
  }

  return (
    <div className="flex-1 min-h-screen bg-background">
      <AuthDialog />
      <DashboardHeader 
        formattedName={formattedName}
        isAdmin={isAdmin}
        jobTitle={jobTitle}
        organizationName={organization?.name}
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
