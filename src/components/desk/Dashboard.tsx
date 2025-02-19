
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, MessageSquare, ArrowUpRight, FileText, Calendar, Megaphone } from "lucide-react";
import { Documents } from "@/components/desk/Documents";
import { ContactsList } from "@/components/desk/ContactsList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const navigate = useNavigate();

  if (showDocuments) {
    return <Documents />;
  }

  if (showContacts) {
    return <ContactsList />;
  }

  const handleCardClick = (feature: string) => {
    switch (feature) {
      case 'calendar':
        window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'calendar' }));
        break;
      case 'messages':
        navigate('/chat');
        break;
      case 'documents':
        setShowDocuments(true);
        break;
      case 'contacts':
        setShowContacts(true);
        break;
      case 'team':
        window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: 'contacts' }));
        break;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome back, John</h2>
      
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
          onClick={() => handleCardClick('messages')}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleCardClick('documents')}
              >
                <FileText className="w-5 h-5 mb-2 text-blue-600" />
                <p className="font-medium">View Documents</p>
                <p className="text-sm text-gray-500">Access your files</p>
              </button>
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleCardClick('calendar')}
              >
                <Calendar className="w-5 h-5 mb-2 text-green-600" />
                <p className="font-medium">Schedule Meeting</p>
                <p className="text-sm text-gray-500">Book a time slot</p>
              </button>
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleCardClick('messages')}
              >
                <MessageSquare className="w-5 h-5 mb-2 text-purple-600" />
                <p className="font-medium">Send Message</p>
                <p className="text-sm text-gray-500">Contact support</p>
              </button>
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleCardClick('team')}
              >
                <Users className="w-5 h-5 mb-2 text-orange-600" />
                <p className="font-medium">Team Directory</p>
                <p className="text-sm text-gray-500">Find colleagues</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
