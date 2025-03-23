import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivitySection } from "./dashboard/ActivitySection";
import { AnnouncementsSection } from "./dashboard/AnnouncementsSection";
import { QuickActions } from "./dashboard/QuickActions";
import { Loader2 } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { userRole, isLoading: isRoleLoading, error: roleError } = useUserRole();

  useEffect(() => {
    console.log('Dashboard mounted, userRole:', userRole, 'isLoading:', isRoleLoading);
  }, [userRole, isRoleLoading]);

  const handleCardClick = (feature: string) => {
    console.log('Card clicked:', feature);
    switch (feature) {
      case 'chat':
        navigate('/chat');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'documents':
        navigate('/documents');
        break;
      case 'organization':
        navigate('/organization');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'contacts':
        navigate('/contacts');
        break;
      case 'leave':
        navigate('/leave');
        break;
      case 'policies':
        navigate('/policies');
        break;
      default:
        break;
    }
  };

  if (isRoleLoading) {
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (roleError) {
    console.error('Role error:', roleError);
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Error loading dashboard. Please try again.</div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Access denied. Please log in again.</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full">
      <DashboardHeader 
        currentView="dashboard"
        onBackClick={() => {}}
        onAdminClick={() => handleCardClick('admin')}
      />
      
      <StatsCards onCardClick={handleCardClick} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySection />
        <AnnouncementsSection />
      </div>

      <QuickActions onActionClick={handleCardClick} />
    </div>
  );
};

export default Dashboard;
