
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Users, Building2, MessageSquare } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            onClick={() => onActionClick('documents')}
          >
            <FileText className="w-5 h-5 mb-2 text-blue-600" />
            <p className="font-medium">Documents</p>
            <p className="text-sm text-gray-500">Access files</p>
          </button>
          <button 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            onClick={() => onActionClick('calendar')}
          >
            <Calendar className="w-5 h-5 mb-2 text-green-600" />
            <p className="font-medium">Calendar</p>
            <p className="text-sm text-gray-500">View schedule</p>
          </button>
          <button 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            onClick={() => onActionClick('contacts')}
          >
            <Users className="w-5 h-5 mb-2 text-orange-600" />
            <p className="font-medium">Contacts</p>
            <p className="text-sm text-gray-500">View directory</p>
          </button>
          <button 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            onClick={() => onActionClick('messages')}
          >
            <MessageSquare className="w-5 h-5 mb-2 text-rose-600" />
            <p className="font-medium">Messages</p>
            <p className="text-sm text-gray-500">View messages</p>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
