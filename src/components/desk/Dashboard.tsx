
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { MainLayout } from "@/components/shared/MainLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat } from "@/hooks/use-chat";
import { Documents } from "@/components/desk/Documents";
import { ContactsList } from "@/components/desk/ContactsList";
import { Calendar as CalendarComponent } from "@/components/desk/Calendar";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { Policies } from "@/components/desk/Policies";
import { PartnerMessages } from "@/components/desk/PartnerMessages";
import { Settings } from "@/components/desk/Settings";

// Import new components
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivitySection } from "./dashboard/ActivitySection";
import { AnnouncementsSection } from "./dashboard/AnnouncementsSection";
import { QuickActions } from "./dashboard/QuickActions";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const navigate = useNavigate();
  const { userRole } = useUserRole();
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

  const handleCalendarActionClick = (view: 'calendar' | 'inbox') => {
    setCalendarView(view);
    setActiveTab('calendar');
  };

  const handleCardClick = (feature: string) => {
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
      default:
        setCurrentView(feature);
    }
  };

  const renderDashboard = () => (
    <div className="p-6">
      <StatsCards onCardClick={handleCardClick} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivitySection />
        <AnnouncementsSection />
      </div>

      <QuickActions onActionClick={handleCardClick} />
    </div>
  );

  const renderFeature = () => {
    switch (currentView) {
      case 'documents':
        navigate('/documents');
        return null;
      case 'contacts':
        return <ContactsList />;
      case 'calendar':
        navigate('/calendar');
        return null;
      case 'leave':
        return <LeaveManager />;
      case 'policies':
        return <Policies />;
      case 'messages':
        return <PartnerMessages />;
      case 'settings':
        navigate('/profile');
        return null;
      default:
        return renderDashboard();
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 min-h-screen bg-gray-50 flex">
        {userRole !== 'org_admin' && (
          <div className="w-80 border-r bg-white">
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
