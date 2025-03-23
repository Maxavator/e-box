
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { MainLayout } from "@/components/shared/MainLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat } from "@/hooks/use-chat";
import { Documents } from "@/components/desk/Documents";
import { ContactsList } from "@/components/desk/ContactsList";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { Policies } from "@/components/desk/Policies";
import { Settings } from "@/components/desk/Settings";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivitySection } from "./dashboard/ActivitySection";
import { AnnouncementsSection } from "./dashboard/AnnouncementsSection";
import { QuickActions } from "./dashboard/QuickActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const navigate = useNavigate();
  const { userRole, isLoading: isRoleLoading, error: roleError } = useUserRole();
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    calendarView,
    setCalendarView,
    selectedConversation,
    filteredConversations,
    handleSelectConversation,
  } = useChat();

  // Load user data on component mount
  useEffect(() => {
    console.log('Dashboard mounted, userRole:', userRole, 'isLoading:', isRoleLoading);
    
    // If staff user, redirect to chat
    if (!isRoleLoading && userRole === 'staff') {
      console.log('Redirecting staff user to chat');
      navigate('/chat');
    }
  }, [userRole, isRoleLoading, navigate]);

  if (isRoleLoading) {
    return (
      <MainLayout>
        <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (roleError) {
    console.error('Role error:', roleError);
    return (
      <MainLayout>
        <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
          <div className="text-red-500">Error loading dashboard. Please try again.</div>
        </div>
      </MainLayout>
    );
  }

  const handleNavigation = (route: string) => {
    try {
      console.log(`Navigating to ${route}`);
      navigate(route);
      toast.success(`Navigating to ${route.replace('/', '')}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate. Please try again.');
    }
  };

  const handleCardClick = (feature: string) => {
    console.log('Card clicked:', feature);
    switch (feature) {
      case 'chat':
        handleNavigation('/chat');
        break;
      case 'admin':
        handleNavigation('/admin');
        break;
      case 'calendar':
        handleNavigation('/calendar');
        break;
      case 'documents':
        handleNavigation('/documents');
        break;
      case 'organization':
        handleNavigation('/organization');
        break;
      case 'profile':
        handleNavigation('/profile');
        break;
      default:
        setCurrentView(feature);
        break;
    }
  };

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setCalendarView(view);
    if (view === 'calendar') {
      handleNavigation('/calendar');
    } else {
      setActiveTab('calendar');
    }
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <StatsCards onCardClick={handleCardClick} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySection />
        <AnnouncementsSection />
      </div>

      <QuickActions onActionClick={handleCardClick} />
    </div>
  );

  const renderFeature = () => {
    switch (currentView) {
      case 'documents':
        handleNavigation('/documents');
        return null;
      case 'contacts':
        return <ContactsList />;
      case 'calendar':
        handleNavigation('/calendar');
        return null;
      case 'leave':
        return <LeaveManager />;
      case 'policies':
        return <Policies />;
      case 'messages':
      case 'chat':
        handleNavigation('/chat');
        return null;
      case 'settings':
      case 'profile':
        handleNavigation('/profile');
        return null;
      default:
        return renderDashboard();
    }
  };

  // Only render the main dashboard content if we have a valid role
  if (!userRole) {
    return (
      <MainLayout>
        <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
          <div className="text-red-500">Access denied. Please log in again.</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 min-h-screen bg-background flex">
        <div className="w-80 border-r bg-card">
          <ChatSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onCalendarActionClick={handleCalendarActionClick}
          />
        </div>
        <div className="flex-1">
          <DashboardHeader 
            currentView={currentView}
            onBackClick={() => setCurrentView('dashboard')}
            onAdminClick={() => handleCardClick('admin')}
          />
          {renderFeature()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
