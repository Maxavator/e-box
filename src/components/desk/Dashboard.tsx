
import { useState } from "react";
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

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const navigate = useNavigate();
  const { userRole, isLoading: isRoleLoading } = useUserRole();
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

  // Show loading state while checking user role
  if (isRoleLoading) {
    return (
      <MainLayout>
        <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Redirect staff users to chat
  if (userRole === 'staff') {
    navigate('/chat');
    return null;
  }

  const handleNavigation = (route: string) => {
    try {
      navigate(route);
      toast.success(`Navigating to ${route.replace('/', '')}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate. Please try again.');
    }
  };

  const handleCardClick = (feature: string) => {
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

  return (
    <MainLayout>
      <div className="flex-1 min-h-screen bg-background flex">
        {userRole !== 'org_admin' && (
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
        )}
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
