
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, Users, FileText, Clock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DeskFeatures() {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: string) => {
    window.dispatchEvent(new CustomEvent('desk-feature-selected', { detail: feature }));
  };

  return (
    <div className="p-4 space-y-2">
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('dashboard')}>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('calendar')}>
        <Calendar className="mr-2 h-4 w-4" />
        My Calendar
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('contacts')}>
        <Users className="mr-2 h-4 w-4" />
        Contacts List
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('documents')}>
        <FileText className="mr-2 h-4 w-4" />
        My Documents
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('leave-manager')}>
        <Clock className="mr-2 h-4 w-4" />
        Leave Manager
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => handleFeatureClick('settings')}>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </div>
  );
}
