
import { FileText, Clock, Scroll, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onActionClick: (feature: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 px-2"
          onClick={() => onActionClick('documents')}
        >
          <FileText className="h-6 w-6 mb-2 text-blue-500" />
          <span className="text-sm font-medium">Documents</span>
          <span className="text-xs text-muted-foreground mt-1 text-center">Access your files</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 px-2"
          onClick={() => onActionClick('leave')}
        >
          <Clock className="h-6 w-6 mb-2 text-amber-500" />
          <span className="text-sm font-medium">Leave</span>
          <span className="text-xs text-muted-foreground mt-1 text-center">Manage time off</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 px-2"
          onClick={() => onActionClick('policies')}
        >
          <Scroll className="h-6 w-6 mb-2 text-green-500" />
          <span className="text-sm font-medium">Policies</span>
          <span className="text-xs text-muted-foreground mt-1 text-center">View guidelines</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 px-2"
          onClick={() => onActionClick('contacts')}
        >
          <Users className="h-6 w-6 mb-2 text-purple-500" />
          <span className="text-sm font-medium">Contacts</span>
          <span className="text-xs text-muted-foreground mt-1 text-center">View colleagues</span>
        </Button>
      </div>
    </div>
  );
}
