
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Users, MessageSquare, Clock, Briefcase } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const { organizationName } = useUserProfile();
  const deskLabel = organizationName ? `Desk @${organizationName}` : 'Desk';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button 
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left dark:hover:bg-muted"
            onClick={() => onActionClick('documents')}
          >
            <FileText className="w-5 h-5 mb-2 text-blue-600" />
            <p className="font-medium">{deskLabel}</p>
            <p className="text-sm text-muted-foreground">Access files</p>
          </button>
          <button 
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left dark:hover:bg-muted"
            onClick={() => onActionClick('calendar')}
          >
            <Calendar className="w-5 h-5 mb-2 text-green-600" />
            <p className="font-medium">Calendar</p>
            <p className="text-sm text-muted-foreground">View schedule</p>
          </button>
          <button 
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left dark:hover:bg-muted"
            onClick={() => onActionClick('chat')}
          >
            <MessageSquare className="w-5 h-5 mb-2 text-rose-600" />
            <p className="font-medium">Messages</p>
            <p className="text-sm text-muted-foreground">View messages</p>
          </button>
          <button 
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left dark:hover:bg-muted"
            onClick={() => onActionClick('contacts')}
          >
            <Users className="w-5 h-5 mb-2 text-orange-600" />
            <p className="font-medium">Contacts</p>
            <p className="text-sm text-muted-foreground">View contacts</p>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
