
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, MessageSquare, ArrowUpRight, FileText, Calendar, Megaphone, ShieldCheck } from "lucide-react";
import { Documents } from "@/components/desk/Documents";
import { ContactsList } from "@/components/desk/ContactsList";
import { Calendar as CalendarComponent } from "@/components/desk/Calendar";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { Policies } from "@/components/desk/Policies";
import { PartnerMessages } from "@/components/desk/PartnerMessages";
import { Settings } from "@/components/desk/Settings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MainLayout } from "@/components/shared/MainLayout";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const navigate = useNavigate();
  const { userRole } = useUserRole();

  const renderFeature = () => {
    switch (currentView) {
      case 'documents':
        return <Documents />;
      case 'contacts':
        return <ContactsList />;
      case 'calendar':
        return <CalendarComponent />;
      case 'leave':
        return <LeaveManager />;
      case 'policies':
        return <Policies />;
      case 'messages':
        return <PartnerMessages />;
      case 'settings':
        return <Settings />;
      default:
        return renderDashboard();
    }
  };

  const handleCardClick = (feature: string) => {
    if (feature === 'chat') {
      navigate('/chat');
      return;
    }
    if (feature === 'admin') {
      navigate('/admin');
      return;
    }
    if (feature === 'calendar') {
      navigate('/calendar');
      return;
    }
    setCurrentView(feature);
  };

  const renderDashboard = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome back, John</h2>
        {userRole === 'org_admin' && (
          <Button
            onClick={() => handleCardClick('admin')}
            className="flex items-center gap-2"
            variant="outline"
          >
            <ShieldCheck className="w-4 h-4" />
            Access Admin Tools
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('calendar')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Events</CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('chat')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">Unread messages</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('documents')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500 mt-1">Recent documents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New payslip available</p>
                  <p className="text-sm text-gray-500">March 2024 payslip has been uploaded</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Team meeting scheduled</p>
                  <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">New message from HR</p>
                  <p className="text-sm text-gray-500">Regarding your recent request</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold text-primary mb-1">New Office Location</h3>
                <p className="text-sm text-gray-600">We're excited to announce our new office location opening next month! Stay tuned for more details.</p>
                <p className="text-xs text-gray-500 mt-2">Posted 2 days ago</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold text-primary mb-1">Company Anniversary</h3>
                <p className="text-sm text-gray-600">Join us in celebrating our 5th year anniversary! Special events planned for next week.</p>
                <p className="text-xs text-gray-500 mt-2">Posted 5 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('documents')}
            >
              <FileText className="w-5 h-5 mb-2 text-blue-600" />
              <p className="font-medium">Documents</p>
              <p className="text-sm text-gray-500">Access files</p>
            </button>
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('calendar')}
            >
              <Calendar className="w-5 h-5 mb-2 text-green-600" />
              <p className="font-medium">Calendar</p>
              <p className="text-sm text-gray-500">View schedule</p>
            </button>
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('leave')}
            >
              <Calendar className="w-5 h-5 mb-2 text-purple-600" />
              <p className="font-medium">Leave</p>
              <p className="text-sm text-gray-500">Manage leave</p>
            </button>
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('contacts')}
            >
              <Users className="w-5 h-5 mb-2 text-orange-600" />
              <p className="font-medium">Contacts</p>
              <p className="text-sm text-gray-500">View directory</p>
            </button>
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('policies')}
            >
              <Building2 className="w-5 h-5 mb-2 text-indigo-600" />
              <p className="font-medium">Policies</p>
              <p className="text-sm text-gray-500">View policies</p>
            </button>
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('messages')}
            >
              <MessageSquare className="w-5 h-5 mb-2 text-rose-600" />
              <p className="font-medium">Messages</p>
              <p className="text-sm text-gray-500">View messages</p>
            </button>
            <button 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleCardClick('settings')}
            >
              <Users className="w-5 h-5 mb-2 text-slate-600" />
              <p className="font-medium">Settings</p>
              <p className="text-sm text-gray-500">Manage account</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex-1 min-h-screen bg-gray-50">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">System Overview</p>
          </div>
          {currentView !== 'dashboard' && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </header>

        {renderFeature()}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
